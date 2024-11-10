'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mic, MicOff, Video, PhoneOff, Users } from 'lucide-react'

export default function VideoCall() {
  return (
    <div className='flex h-screen bg-black text-white'>
      <div className='flex flex-1 flex-col'>
        {/* Main video area */}
        <div className='relative flex-1'>
          <video autoPlay playsInline muted className='h-full w-full object-cover' />
          <div className='absolute bottom-4 left-4 rounded bg-black bg-opacity-50 px-2 py-1'>John Doe</div>
        </div>

        {/* Call controls */}
        <div className='flex h-20 items-center justify-center space-x-4 bg-gray-900'>
          <Button
            variant='outline'
            size='icon'
            className='rounded-full border-gray-600 bg-gray-800 text-white hover:bg-gray-700'
          >
            <Mic className='h-6 w-6' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='rounded-full border-gray-600 bg-gray-800 text-white hover:bg-gray-700'
          >
            <Video className='h-6 w-6' />
          </Button>
          <Button variant='destructive' size='icon' className='rounded-full bg-red-500 text-white hover:bg-red-600'>
            <PhoneOff className='h-6 w-6' />
          </Button>
        </div>
      </div>

      {/* Sidebar with participant thumbnails */}
      <div className='w-64 overflow-y-auto bg-gray-900 p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-bold'>Participants</h2>
          <Users className='h-5 w-5' />
        </div>
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Card key={i} className='mb-4 overflow-hidden bg-gray-800'>
            <video autoPlay playsInline muted className='h-24 w-full object-cover' />
            <div className='flex items-center justify-between p-2'>
              <span>User {i}</span>
              <MicOff className='h-4 w-4 text-gray-400' />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
