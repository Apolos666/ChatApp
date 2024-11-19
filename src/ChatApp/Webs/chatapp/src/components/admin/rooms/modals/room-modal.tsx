import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsTrigger, TabsList, TabsContent } from '@/components/ui/tabs'
import { Room } from '@/types'
import { useState } from 'react'
import { Info, PlusCircle, Save, Users, Pencil } from 'lucide-react'
import RoomDetailsContent from './room-details-content'
import RoomMembersContent from './room-members-content'
import { Button } from '@/components/ui/button'

interface RoomModalProps {
  room?: Room | null
  mode: 'add' | 'edit' | 'view' | null
  onClose: () => void
  onSuccess?: () => void
}

export function RoomModal({ room, mode, onClose, onSuccess }: RoomModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'members'>('details')
  const [isEditing, setIsEditing] = useState(false)

  const handleCancel = () => {
    if (isEditing) {
      setIsEditing(false)
    } else {
      onClose()
    }
  }

  const handleClose = () => {
    setIsEditing(false)
    onClose()
  }

  const titles = {
    add: 'Create New Room',
    edit: 'Edit Room',
    view: 'Room Information'
  } as const

  if (!mode) return null

  return (
    <Dialog open={mode !== null} onOpenChange={handleClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{titles[mode as keyof typeof titles]}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'details' | 'members')}>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='details' className='flex items-center gap-2'>
              <Info className='h-4 w-4' />
              Details
            </TabsTrigger>
            <TabsTrigger value='members' className='flex items-center gap-2'>
              <Users className='h-4 w-4' />
              Members
            </TabsTrigger>
          </TabsList>

          <TabsContent value='details'>
            <RoomDetailsContent mode={mode} isEditing={isEditing} room={room} />
          </TabsContent>

          <TabsContent value='members'>
            <RoomMembersContent room={room} isEditing={isEditing} mode={mode} />
          </TabsContent>
        </Tabs>

        <div className='mt-4 flex justify-between space-x-2'>
          {(mode === 'view' && !isEditing) ? (
            <Button onClick={() => setIsEditing(true)} className="ml-auto">
              <Pencil className='mr-2 h-4 w-4' />
              Edit
            </Button>
          ) : (
            <>
              <Button variant='outline' onClick={handleCancel}>
                Cancel
              </Button>
              <Button>
                {mode === 'add' ? (
                  <>
                    <PlusCircle className='mr-2 h-4 w-4' />
                    Create Room
                  </>
                ) : (
                  <>
                    <Save className='mr-2 h-4 w-4' />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
