import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsTrigger, TabsList, TabsContent } from '@/components/ui/tabs'
import { Room } from '@/types'
import { useState, useEffect } from 'react'
import { Info, Users } from 'lucide-react'
import RoomDetailsContent from './room-details-content'
import RoomMembersContent from './room-members-content'
import RoomAddContent from './room-add-content'

// Types
interface RoomModalProps {
  room?: Room | null
  mode: ModalMode
  onClose: () => void
  onSuccess?: () => void
}

type ModalMode = 'add' | 'manage' | null
type TabType = 'details' | 'members'

// Constants
const MODAL_TITLES = {
  add: 'Create New Room',
  manage: 'Manage Room',
  view: 'Manage Room'
} as const

const DEFAULT_TAB: TabType = 'members'

export function RoomModal({ 
  room: initialRoom, 
  mode, 
  onClose, 
  onSuccess 
}: RoomModalProps) {
  // State
  const [room, setRoom] = useState<Room | null>(initialRoom || null)
  const [activeTab, setActiveTab] = useState<TabType>(DEFAULT_TAB)

  // Effects
  useEffect(() => {
    setRoom(initialRoom || null)
  }, [initialRoom])

  // Handlers
  const handleTabChange = (value: string) => {
    setActiveTab(value as TabType)
  }

  const handleRoomUpdate = (updatedRoom: Room) => {
    setRoom(updatedRoom)
    onSuccess?.()
  }

  // Guard clause
  if (!mode) return null

  // Render helpers
  const renderManageTabs = () => (
    <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='members' className='flex items-center gap-2'>
          <Users className='h-4 w-4' />
          Members
        </TabsTrigger>
        <TabsTrigger value='details' className='flex items-center gap-2'>
          <Info className='h-4 w-4' />
          Information
        </TabsTrigger>
      </TabsList>

      <TabsContent value='details'>
        <RoomDetailsContent room={room} />
      </TabsContent>

      <TabsContent value='members'>
        <RoomMembersContent
          room={room}
          onSuccess={handleRoomUpdate}
        />
      </TabsContent>
    </Tabs>
  )

  return (
    <Dialog open={mode !== null} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{MODAL_TITLES[mode]}</DialogTitle>
        </DialogHeader>

        {mode === 'manage' && renderManageTabs()}
        
        {mode === 'add' && (
          <RoomAddContent 
            room={room} 
            onSuccess={onSuccess} 
            onCancel={onClose} 
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
