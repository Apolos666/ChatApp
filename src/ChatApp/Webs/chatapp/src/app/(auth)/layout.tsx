import React, { ReactNode } from 'react'
import Link from 'next/link'
import { Zap } from 'lucide-react'

function Header() {
  return (
    <header className='w-full bg-white fixed top-0 z-20 flex justify-between py-2 px-6 items-center border-b'>
      <Link
        className='group hover:bg-black hover:border-white text-lg text-black text-semibold p-2 border border-black border-2 rounded-lg'
        href='/'
      >
        <Zap className='size-6 group-hover:text-white' />
      </Link>
      <div className='flex items-center'>
        <Link href='/singup' className='bg-black text-white rounded-md py-2 px-4 hover:bg-black/80'>
          Sign up
        </Link>
      </div>
    </header>
  )
}

function Vignette() {
  return (
    <div className='w-full h-full absolute overflow-hidden'>
      <div className='size-80 absolute top-[6vh] right-[-10vw] rounded-full bg-black/70 blur-[100px]'></div>
      <div className='size-80 absolute top-1/2 left-[-10vw] rounded-full bg-black/70 blur-[100px]'></div>
    </div>
  )
}

function layout({ children }: { children: ReactNode }) {
  return (
    <div className='relative w-full h-[120vh] flex items-center justify-center'>
      <Header />
      <div className='relative z-10'>{children}</div>
      <Vignette />
    </div>
  )
}

export default layout
