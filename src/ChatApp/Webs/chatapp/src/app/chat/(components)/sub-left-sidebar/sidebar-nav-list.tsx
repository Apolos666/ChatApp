import Link from 'next/link'
import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { MessageSquare } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface INavItem {
  title: string
  href: string
  icon: ReactNode
}

function NavItem({ item }: { item: INavItem }) {
  const { title, href, icon } = item
  const path = usePathname()

  const isActive = path.includes(href)

  return (
    <Link
      href={href}
      className={cn(
        'block flex size-full flex-col items-center justify-center gap-2 rounded-lg py-4 hover:bg-white/20',
        isActive && 'bg-white/10'
      )}
    >
      {icon}
      <span className='text-xs text-white'>{title}</span>
    </Link>
  )
}

function WorkNavList() {
  const navs = [
    {
      title: 'Chats',
      icon: <MessageSquare className='text-white' />,
      href: '/chat'
    }
  ]

  return (
    <ul className='flex w-full list-none flex-col items-center'>
      {navs.map((nav, index) => (
        <li key={index} className='size-full'>
          <NavItem item={nav} />
        </li>
      ))}
    </ul>
  )
}

function SidebarNavList() {
  return (
    <div className='flex h-auto w-full flex-1 flex-col items-center divide-y'>
      <WorkNavList />
    </div>
  )
}

export default SidebarNavList
