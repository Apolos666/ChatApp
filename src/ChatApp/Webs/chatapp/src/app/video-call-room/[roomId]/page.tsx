'use client'

import { useEffect, useState } from 'react'
import VideoCall from './(components)/VideoCall'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const joinRoom = async () => {
      try {
        const response = await fetch(`http://localhost:5221/api/video-call/join/${params.roomId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getLocalStorageItem(PersistedStateKey.Token)}`
          }
        })

        if (!response.ok) {
          const data = await response.json()
          setError(data.error)
          return
        }
      } catch (err) {
        setError('Không thể tham gia phòng họp')
      }
    }

    joinRoom()
  }, [params.roomId])

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertTitle>Lỗi</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return <VideoCall roomId={params.roomId} />
}
