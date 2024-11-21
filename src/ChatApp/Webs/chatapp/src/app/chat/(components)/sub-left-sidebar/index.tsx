import React from 'react'
import UserInfo from './user-info'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import SidebarNavList from './sidebar-nav-list'
import { setLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'
import { queryClient } from '@/providers/query-provider'

function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    router.replace('/signin')
    // Refresh credentials in local storate
    setLocalStorageItem(PersistedStateKey.MeId, '')
    setLocalStorageItem(PersistedStateKey.Token, '')
    setLocalStorageItem(PersistedStateKey.RefreshToken, '')
    queryClient.clear()
  }

  return (
    <button
      type='button'
      onClick={handleLogout}
      className='flex flex-col items-center gap-2 rounded-md p-2 hover:bg-white/20'
    >
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
