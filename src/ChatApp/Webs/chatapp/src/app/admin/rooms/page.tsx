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
import { DataTablePagination } from '@/components/ui/data-table-pagination'
import { PageSizeSelector } from '@/components/admin/users/table/page-size-selector'
import RowActions from '@/components/admin/users/table/row-actions'
import { RoomFilters, DEFAULT_FILTERS } from '@/components/admin/rooms/toolbar/filter-button'
import { RoomModal } from '@/components/admin/rooms/modals/room-modal'

interface ModalState {
  mode: 'add' | 'edit' | 'view' | null;
  room: Room | null;
}

export default function RoomsPage() {
  // States for data and loading
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFilterLoading, setIsFilterLoading] = useState(false)
  const [filters, setFilters] = useState<RoomFilters>(DEFAULT_FILTERS)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });
  const [modal, setModal] = useState<ModalState>({ mode: null, room: null });

  // Delete handler
  const handleDelete = async (ids: (string | number)[]) => {
    console.log('Deleting rooms:', ids)
  }

  const handleEdit = (room: Room) => setModal({ mode: 'edit', room });
  const handleView = (room: Room) => setModal({ mode: 'view', room });
  const handleManageUsers = (room: Room) => setModal({ mode: 'manage-users', room });
  const handleClose = () => setModal({ mode: null, room: null });

  const columns = useMemo(() => getColumns({
    onEdit: handleEdit,
    onView: handleView,
    onManageUsers: handleManageUsers,
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
      <RoomsToolbar 
        table={table} 
        filters={filters} 
        setFilters={setFilters} 
        onAdd={() => setModal({ mode: 'add', room: null })} 
        isLoading={isLoading}
        setIsFilterLoading={setIsFilterLoading}
      />

      {/* Row Actions */}
      <RowActions 
        table={table} 
        onDelete={handleDelete} // Bulk delete
      />

      {/* Rooms Table */}
      <RoomsTable 
        table={table} 
        pageSize={pagination.pageSize}            // For skeleton
        isLoading={isLoading || isFilterLoading}  // For skeleton
      />

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

      <RoomModal
        room={modal.room}
        mode={modal.mode}
        onClose={handleClose}
        onSuccess={fetchRooms}
      />
    </div>
  )
}
