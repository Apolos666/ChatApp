import { ColumnDef } from '@tanstack/react-table'
import { Room } from '@/types'
import { SortableTableHeader } from '../../users/table/sortable-table-header'
import { Checkbox } from '@/components/ui/checkbox'
import { formatDate } from '@/lib/utils'
import { RoomActionsCell } from './room-actions-cell'

interface GetColumnsProps {
  onEdit: (room: Room) => void
  onView: (room: Room) => void
  handleDelete: (ids: string[]) => void
}

export const getColumns = ({ onEdit, onView, handleDelete }: GetColumnsProps): ColumnDef<Room>[] => [
  {
    accessorKey: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <SortableTableHeader column={column} title='Room Name' />,
    cell: ({ row }) => {
      const room = row.original
      return (
        <div className='flex items-center gap-3'>
          <span>{room.name}</span>
        </div>
      )
    }
  },
  {
    accessorKey: 'creatorId',
    header: ({ column }) => <SortableTableHeader column={column} title='Creator' />,
    cell: ({ row }) => {
      const room = row.original
      const creator = room.members.find((member) => member.id === room.creatorId)
      return <span>{creator?.name}</span>
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortableTableHeader column={column} title='Created At' align='center' />,
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string
      return <div className='text-center'>{formatDate(createdAt)}</div>
    },
    filterFn: (row, id, value: { from: string; to: string }) => {
      const date = new Date(row.original.createdAt)
      // Check if both from and to dates are provided
      if (value.from && value.to) {
        return date >= new Date(value.from) && date <= new Date(value.to)
      }
      // Check if only from date is provided
      if (value.from) {
        const fromDate = new Date(value.from)
        return (
          date.getFullYear() === fromDate.getFullYear() &&
          date.getMonth() === fromDate.getMonth() &&
          date.getDate() === fromDate.getDate()
        )
      }
      // Check if only to date is provided
      if (value.to) {
        const toDate = new Date(value.to)
        return (
          date.getFullYear() === toDate.getFullYear() &&
          date.getMonth() === toDate.getMonth() &&
          date.getDate() === toDate.getDate()
        )
      }
      return true
    }
  },
  {
    accessorKey: 'members',
    header: ({ column }) => <SortableTableHeader column={column} title='Members Count' align='center' />,
    cell: ({ row }) => {
      const room = row.original
      return <div className='text-center'>{room.members.length}</div>
    },
    filterFn: (row, id, value: { min: number | null; max: number | null }) => {
      return row.original.members.length >= (value.min ?? 0) && row.original.members.length <= (value.max ?? 50)
    }
  },
  {
    id: 'actions',
    header: ({ column }) => <SortableTableHeader column={column} title='Actions' align='center' isEnabled={false} />,
    cell: ({ row }) => (
      <div className='flex justify-center'>
        <RoomActionsCell
          room={row.original}
          onView={(room) => onView(room)}
          onEdit={(room) => onEdit(room)}
          onDelete={(room) => handleDelete([room.id])}
        />
      </div>
    ),
    enableSorting: false
  }
]
