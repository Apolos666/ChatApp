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
  getPaginationRowModel,
} from '@tanstack/react-table'
import { getColumns } from '@/components/admin/rooms/table/columns'
import { httpDelPrivate, httpGetPrivate } from '@/services/user.service.api/_req'
import { toast } from 'sonner'
import { DataTablePagination } from '@/components/ui/data-table-pagination'
import { PageSizeSelector } from '@/components/admin/users/table/page-size-selector'
import RowActions from '@/components/admin/users/table/row-actions'
import { RoomFilters, DEFAULT_FILTERS } from '@/components/admin/rooms/toolbar/filter-button'
import { RoomModal } from '@/components/admin/rooms/modals/room-modal'

// Types
interface ModalState {
  mode: 'add' | 'manage' | null
  room: Room | null
}

// Constants
const DEFAULT_PAGE_SIZE = 10
const DEFAULT_PAGE_INDEX = 0

export default function RoomsPage() {
  // Data states
  const [rooms, setRooms] = useState<Room[]>([])
  const [filters, setFilters] = useState<RoomFilters>(DEFAULT_FILTERS)
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [isFilterLoading, setIsFilterLoading] = useState(false)
  
  // UI states
  const [modal, setModal] = useState<ModalState>({ mode: null, room: null })
  const [pagination, setPagination] = useState({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE
  })

  // Handlers
  const handleDelete = async (ids: (string | number)[]) => {
    try {
      let successCount = 0
      for (const id of ids) {
        await httpDelPrivate(`/management/rooms/${id}`)
        successCount++
      }
      toast.success(`Successfully deleted ${successCount} room${successCount > 1 ? 's' : ''}.`)
      fetchRooms()
    } catch (error) {
      console.error('Error deleting rooms:', error)
      toast.error('Failed to delete rooms')
    }
  }

  const handleManage = (room: Room) => setModal({ mode: 'manage', room })
  const handleClose = () => setModal({ mode: null, room: null })
  const handleAdd = () => setModal({ mode: 'add', room: null })
  const handlePageSizeChange = (size: number) => setPagination(prev => ({ ...prev, pageSize: size }))

  // Data fetching
  const fetchRooms = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await httpGetPrivate('/management/rooms')
      setRooms(response.data)
    } catch (error) {
      toast.error('Failed to fetch rooms')
      console.error('Error fetching rooms:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Table configuration
  const columns = useMemo(
    () => getColumns({
      onManage: handleManage,
      handleDelete
    }),
    []
  )

  const table = useReactTable({
    data: rooms,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination
  })

  // Effects
  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  // Loading state
  const isTableLoading = isLoading || isFilterLoading

  return (
    <div className='space-y-4'>
      <RoomsToolbar
        table={table}
        filters={filters}
        setFilters={setFilters}
        onAdd={handleAdd}
        isLoading={isLoading}
        setIsFilterLoading={setIsFilterLoading}
      />

      <RowActions
        table={table}
        onDelete={handleDelete}
      />

      <RoomsTable
        table={table}
        pageSize={pagination.pageSize}
        isLoading={isTableLoading}
      />

      <div className='flex items-center'>
        <div className='flex-1'>
          <PageSizeSelector
            table={table}
            onPageSizeChange={handlePageSizeChange}
          />
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
