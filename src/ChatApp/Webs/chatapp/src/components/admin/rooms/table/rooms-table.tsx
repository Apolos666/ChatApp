import { Table } from '@tanstack/react-table'
import { Room } from '@/types/room'
import { Table as UITable, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table'
import { flexRender } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { RoomsTableSkeleton } from './table-skeleton'

interface RoomsTableProps {
  table: Table<Room>
  pageSize?: number
  isLoading: boolean
}

export function RoomsTable({ table, pageSize = 10, isLoading }: RoomsTableProps) {
  return (
    <div className='rounded-md border'>
      <UITable>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn({
                    'w-[30px]': header.id === 'select',
                    'w-[250px]': header.id === 'name',
                    'w-[150px]': ['creatorId', 'createdAt'].includes(header.id),
                    'w-[100px]': ['members', 'actions'].includes(header.id)
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
            <RoomsTableSkeleton columnsCount={table.getHeaderGroups()?.[0]?.headers?.length || 1} rowsCount={pageSize} />
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
      </UITable>
    </div>
  )
}
