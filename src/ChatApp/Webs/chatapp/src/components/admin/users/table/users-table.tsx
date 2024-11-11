'use client'

import { useEffect, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  flexRender,
  OnChangeFn,
  VisibilityState
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { User as UserType } from '@/types'
import { UserModal } from '../modals/user-modal'
import { UsersToolbar } from '../toolbar/users-toolbar'
import { getColumns } from './columns'
import { PageSizeSelector } from './page-size-selector'
import { DataTablePagination } from '@/components/ui/data-table-pagination'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import RowActions from './row-actions'
import { Filters } from '../toolbar/filter-button'
import {
  httpGet as adminHttpGet,
  httpPut as adminHttpPut,
  httpDel as adminHttpDelete
} from '@/services/user.service.api/_adminReq'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { PersistedStateKey } from '@/data/persisted-keys'
import { getLocalStorageItem } from '@/utils/local-storage'

export function UsersTable() {
  const { toast } = useToast()
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [resetPassword, setResetPassword] = useState<UserType | null>(null)
  const [pageSize, setPageSize] = useState(5)
  const [filters, setFilters] = useState<Filters>({ role: [], status: [], startDate: null, endDate: null })
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    name: true,
    email: true,
    phone_number: false,
    role: true,
    status: true,
    created_at: false
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [users, setUsers] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await adminHttpGet('/admin/users')
      console.log('response', response)
      setUsers(response.data)
    } catch (error) {
      toast({
        title: 'Error fetching users',
        description: 'Failed to fetch users',
        variant: 'destructive'
      })
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (updatedUser: UserType) => {
    try {
      const requestBody = {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role_id: updatedUser.role_id,
        // is_active: Boolean(updatedUser.is_active),
        dob: updatedUser.dob,
        phone_number: updatedUser.phone_number,
        address: updatedUser.address
      }

      await adminHttpPut('/admin/user', requestBody)

      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))

      toast({
        title: 'User updated',
        description: 'User has been updated successfully.'
      })

      setIsEditMode(false)
      setSelectedUser(null)
    } catch (error) {
      toast({
        title: 'Error updating user',
        description: 'Failed to update user',
        variant: 'destructive'
      })
      console.error('Error updating user:', error)
    }
  }

  const handleDelete = async (ids: string[]) => {
    try {
      const currentAdminId = getLocalStorageItem(PersistedStateKey.MeId)
      const idsToDelete = ids.filter((id) => id !== currentAdminId)

      if (idsToDelete.length === 0) {
        toast({
          title: 'Error deleting users',
          description: 'You cannot delete yourself',
          variant: 'destructive'
        })
        return
      }

      let successCount = 0

      // Delete users one by one
      for (const id of idsToDelete) {
        await adminHttpDelete(`/admin/user/${id}`)
        successCount++
      }

      setUsers(users.filter((user) => !idsToDelete.includes(user.id)))

      toast({
        title: 'Users deleted',
        description: `Successfully deleted ${successCount} user${successCount > 1 ? 's' : ''}.`
      })
    } catch (error) {
      toast({
        title: 'Error deleting users',
        description: 'Failed to complete all deletions',
        variant: 'destructive'
      })
      console.error('Error deleting users:', error)

      // Refresh the users list to ensure accurate state
      fetchUsers()
    }
  }

  // Initialize the table with data and configurations
  const table = useReactTable({
    data: users,
    columns: getColumns({
      setSelectedUser,
      setIsEditMode,
      handleDelete,
      setResetPassword
    }),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility as OnChangeFn<VisibilityState>,
    enableColumnResizing: true,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      columnVisibility
    },
    initialState: {
      pagination: {
        pageSize: pageSize
      }
    }
  })

  return (
    <div className='relative space-y-4'>
      {isLoading && <LoadingSpinner />}

      {/* Toolbar */}
      <UsersToolbar
        table={table}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        filters={filters}
        setFilters={setFilters}
      />

      {/* Row Actions */}
      <RowActions table={table} onDelete={handleDelete} />

      {/* Table */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn({
                      'w-[30px]': header.id === 'select',
                      'w-[250px]': header.id === 'name',
                      'w-[200px]': ['email', 'phone_number'].includes(header.id),
                      'w-[150px]': ['created_at', 'role', 'is_active'].includes(header.id),
                      'w-[100px]': header.id === 'actions'
                    })}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={table.getHeaderGroups()?.[0]?.headers?.length || 1} className='h-24 text-center'>
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel()?.rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getHeaderGroups()?.[0]?.headers?.length || 1} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex items-center'>
        <div className='flex-1'>
          <PageSizeSelector table={table} onPageSizeChange={setPageSize} />
        </div>
        <div className='flex flex-1 justify-center'>
          <DataTablePagination table={table} />
        </div>
        <div className='flex-1' />
      </div>

      {/* User Modal */}
      <UserModal
        user={selectedUser}
        open={!!selectedUser}
        onClose={() => {
          setSelectedUser(null)
          setIsEditMode(false)
        }}
        onSave={handleSave}
        initialEditMode={isEditMode}
      />
    </div>
  )
}
