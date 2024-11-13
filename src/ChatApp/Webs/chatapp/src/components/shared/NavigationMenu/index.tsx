import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { HiXMark } from 'react-icons/hi2'
import { LiaAngleLeftSolid } from 'react-icons/lia'
import { NavigationMenuProvider } from './context'
import { useSelectedItemsHistory } from './useSelectedItemsHistory'

function NavigationMenu({
  title,
  onClosePopover,
  className,
  children
}: {
  title: string
  className?: string
  onClosePopover?: () => void
  children: ReactNode
}) {
  const { selectedItemsHistory, currentSelectedItem, handleSelectItem, handleGoBack } = useSelectedItemsHistory()

  const { menuTitle } = currentSelectedItem || {}

  const handleCloseNavigationMenu = () => {
    onClosePopover && onClosePopover()
  }

  return (
    <NavigationMenuProvider
      value={{
        selectedItemsHistory,
        currentSelectedItem,
        handleSelectItem,
        handleGoBack
      }}
    >
      <div className={cn('flex w-full flex-col', className)}>
        <div className='flex items-center justify-between px-4'>
          {currentSelectedItem && (
            <button onClick={handleGoBack} className='rounded-md p-2 hover:bg-gray-200'>
              <LiaAngleLeftSolid className='text-sm' />
            </button>
          )}
          <span className='flex-1 text-center text-sm font-medium text-slate-800'>{menuTitle || title}</span>
          <button onClick={handleCloseNavigationMenu} className='rounded-md p-2 hover:bg-gray-200'>
            <HiXMark className='text-sm' />
          </button>
        </div>
        {children}
      </div>
    </NavigationMenuProvider>
  )
}

export default NavigationMenu
