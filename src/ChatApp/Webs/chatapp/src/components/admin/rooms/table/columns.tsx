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
    }
  },
  {
    accessorKey: 'members',
    header: ({ column }) => <SortableTableHeader column={column} title='Members Count' align='center' />,
    cell: ({ row }) => {
      const room = row.original
      return <div className='text-center'>{room.members.length}</div>
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <RoomActionsCell
        room={row.original}
        onView={(room) => onView(room)}
        onEdit={(room) => onEdit(room)}
        onDelete={(room) => handleDelete([room.id])}
      />
    )
  }
]
