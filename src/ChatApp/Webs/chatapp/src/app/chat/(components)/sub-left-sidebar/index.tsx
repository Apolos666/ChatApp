import React from 'react'
import UserInfo from './user-info'
import { LogOut } from 'lucide-react'
import SidebarNavList from './sidebar-nav-list'

function LogoutButton() {
  return (
    <button type='button' className='flex flex-col items-center gap-2 rounded-md p-2 hover:bg-white/20'>
      <LogOut className='text-white' />
      <span className='text-xs text-white'>Đăng xuất</span>
    </button>
  )
}

function SubLeftSidebar() {
  return (
    <div className='flex h-full w-24 flex-col items-center justify-between gap-10 bg-[#202022] px-2 py-4'>
      <UserInfo />
      <SidebarNavList />
      <LogoutButton />
    </div>
  )
}

export default SubLeftSidebar
