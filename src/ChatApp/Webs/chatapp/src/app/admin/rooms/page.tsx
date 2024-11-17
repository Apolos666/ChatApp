'use client'

import { RoomsTable } from '@/components/admin/rooms/table/rooms-table'
import { RoomsToolbar } from '@/components/admin/rooms/toolbar/rooms-toolbar'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { Room } from '@/types/room'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel
} from '@tanstack/react-table'
import { getColumns } from '@/components/admin/rooms/table/columns'
import { httpGetPrivate } from '@/services/user.service.api/_req'
import { toast } from 'sonner'
import { ViewRoomModal } from '@/components/admin/rooms/modals/view-room-modal'
import { EditRoomModal } from '@/components/admin/rooms/modals/edit-room-modal'
import { AddRoomModal } from '@/components/admin/rooms/modals/add-room-modal'
import { DataTablePagination } from '@/components/ui/data-table-pagination'
import { PageSizeSelector } from '@/components/admin/users/table/page-size-selector'
import RowActions from '@/components/admin/users/table/row-actions'

interface ModalState {
  mode: 'add' | 'edit' | 'view' | null;
  room: Room | null;
}

export default function RoomsPage() {
  // States for data and loading
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  });
  const [modal, setModal] = useState<ModalState>({ mode: null, room: null });

  // Delete handler
  const handleDelete = async (ids: (string | number)[]) => {
    console.log('Deleting rooms:', ids)
  }

  const handleEdit = (room: Room) => setModal({ mode: 'edit', room });
  const handleView = (room: Room) => setModal({ mode: 'view', room });
  const handleClose = () => setModal({ mode: null, room: null });

  const columns = useMemo(() => getColumns({
    onEdit: handleEdit,
    onView: handleView,
    handleDelete
  }), [])

  const table = useReactTable({
    data: rooms,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination
    },
    onPaginationChange: setPagination
  })

  const fetchRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await httpGetPrivate('/management/rooms');
      setRooms(response.data);
    } catch (error) {
      toast.error('Failed to fetch rooms');
      console.error('Error fetching rooms:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return (
    <div className='space-y-4'>
      {/* Toolbar */}
      <RoomsToolbar table={table} onAdd={() => setModal({ mode: 'add', room: null })} />

      {/* Row Actions */}
      <RowActions table={table} onDelete={handleDelete} />

      {/* Rooms Table */}
      <RoomsTable table={table} isLoading={isLoading} />

      {/* Pagination */}
      <div className='flex items-center'>
        <div className='flex-1'>
          <PageSizeSelector table={table} onPageSizeChange={(size) => setPagination({ ...pagination, pageSize: size })} />
        </div>
        <div className='flex flex-1 justify-center'>
          <DataTablePagination table={table} />
        </div>
        <div className='flex-1' />
      </div>

      {/* Modal for viewing room details */}
      {modal.mode === 'view' && modal.room && (
        <ViewRoomModal
          room={modal.room}
          onClose={handleClose}
        />
      )}

      {/* Modal for editing room details */}
      {modal.mode === 'edit' && modal.room && (
        <EditRoomModal
          room={modal.room}
          onClose={handleClose}
        />
      )}

      {/* Modal for adding a new room */}
      {modal.mode === 'add' && (
        <AddRoomModal
          onClose={handleClose}
        />
      )}
    </div>
  )
}
