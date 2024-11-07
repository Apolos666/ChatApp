import { Users, Pin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from '@/components/ui/sidebar'
import { AddMemberDialog } from '../utils/add-member-dialog'

export const GroupInfo = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className='mb-2 text-base font-semibold text-typography-heading'>
        The family is to Love
      </SidebarGroupLabel>
      <div className='space-y-4'>
        <SidebarGroupContent className='space-y-2'>
          <AddMemberDialog
            trigger={
              <Button variant='outline' className='h-12 w-full justify-start'>
                <Users size={24} className='mr-2' />
                <span>Thêm thành viên</span>
              </Button>
            }
            onAddMember={(userId) => {
              console.log('Thêm thành viên mới vào nhóm:', userId)
            }}
          />
          <Button variant='outline' className='h-12 w-full justify-start'>
            <Pin size={24} className='mr-2' />
            <span>Ghim hội thoại</span>
          </Button>
        </SidebarGroupContent>
      </div>
    </SidebarGroup>
  )
}
