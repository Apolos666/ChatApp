'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mic, MicOff, Video, PhoneOff, Users, VideoOff } from 'lucide-react'
import Peer from 'simple-peer'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'

export default function VideoCall({ roomId }: { roomId: string }) {
  const [connection, setConnection] = useState<HubConnection | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({})
  const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected')
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const peersRef = useRef<Record<string, Peer.Instance>>({})

  const initiatorStatusRef = useRef<Record<string, boolean>>({})

  const toggleAudio = useCallback(() => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsAudioEnabled(!isAudioEnabled)
    }
  }, [stream, isAudioEnabled])

  const toggleVideo = useCallback(() => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsVideoEnabled(!isVideoEnabled)
    }
  }, [stream, isVideoEnabled])

  useEffect(() => {
    console.log('Initializing SignalR connection...')
    const newConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5221/videoCallHub', {
        accessTokenFactory: () => getLocalStorageItem(PersistedStateKey.Token) || '',
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build()

    // Thêm các event handlers cho connection state
    newConnection.onreconnecting((error) => {
      console.log('Attempting to reconnect:', error)
      setConnectionStatus('Reconnecting...')
    })

    newConnection.onreconnected((connectionId) => {
      console.log('Reconnected with ID:', connectionId)
      setConnectionStatus('Connected')
    })

    newConnection.onclose((error) => {
      console.log('Connection closed:', error)
      setConnectionStatus('Disconnected')
    })

    setConnection(newConnection)

    console.log('Requesting media devices...')
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        console.log('Media stream obtained successfully')
        setStream(mediaStream)
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream
        }
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error)
        setConnectionStatus('Media Device Error')
      })
    return () => {
      console.log('Cleaning up resources...')
      if (stream) {
        console.log('Stopping all tracks')
        stream.getTracks().forEach((track) => {
          track.stop()
          console.log(`Track ${track.kind} stopped`)
        })
      }

      if (Object.keys(peersRef.current).length > 0) {
        console.log('Destroying all peer connections')
        Object.entries(peersRef.current).forEach(([userId, peer]) => {
          console.log(`Destroying peer connection for user: ${userId}`)
          peer.destroy()
        })
      }

      if (connection) {
        console.log('Stopping SignalR connection')
        connection.stop().catch((err) => {
          console.error('Error stopping connection:', err)
        })
      }
    }
  }, [])

  const createPeer = (userId: string, stream: MediaStream, isInitiator: boolean): Peer.Instance => {
    console.log('Creating new peer for:', userId, 'isInitiator:', isInitiator)

    // Lưu trạng thái initiator
    initiatorStatusRef.current[userId] = isInitiator

    const peer = new Peer({
      initiator: isInitiator,
      trickle: false,
      stream,
      config: {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478' }]
      }
    })

    peer.on('signal', (signal) => {
      console.log('Signaling:', userId, signal.type, signal)
      if (connection) {
        connection.invoke('SendSignal', JSON.stringify(signal), roomId, userId)
      }
    })

    peer.on('stream', (remoteStream) => {
      console.log('Received stream from:', userId)
      setRemoteStreams((prev) => ({
        ...prev,
        [userId]: remoteStream
      }))
    })

    peer.on('error', (err) => {
      console.error('Peer error:', err)
      removePeer(userId)
    })

    peer.on('close', () => {
      console.log('Peer closed:', userId)
      removePeer(userId)
    })

    peersRef.current[userId] = peer
    return peer
  }
  const removePeer = (userId: string) => {
    console.log('Removing peer:', userId)
    if (peersRef.current[userId]) {
      peersRef.current[userId].destroy()
      delete peersRef.current[userId]
      delete initiatorStatusRef.current[userId]
      setRemoteStreams((prev) => {
        const newStreams = { ...prev }
        delete newStreams[userId]
        return newStreams
      })
    }
  }

  useEffect(() => {
    if (!connection || !stream) return

    console.log('Starting SignalR connection...')
    connection
      .start()
      .then(() => {
        console.log('SignalR Connected successfully')
        setConnectionStatus('Connected')
        console.log(`Joining room: ${roomId}`)
        return connection.invoke('JoinRoom', roomId)
      })
      .then(() => {
        console.log(`Successfully joined room: ${roomId}`)
      })
      .catch((err) => {
        console.error('SignalR Connection error:', err)
        setConnectionStatus('Connection Error')
      })

    const handleUserConnected = (userId: string) => {
      console.log('User connected:', userId)
      if (!peersRef.current[userId]) {
        createPeer(userId, stream, true)
      }
    }

    const handleReceiveSignal = (signal: string, userId: string) => {
      try {
        const signalData = JSON.parse(signal)
        console.log('Received signal from:', userId, 'type: ', signalData.type)

        let peer = peersRef.current[userId]

        if (!peer) {
          console.log('Called create peer')
          peer = createPeer(userId, stream, false)
        }

        // Sử dụng initiatorStatusRef thay vì peer.initiator
        if (signalData.type === 'offer' && !initiatorStatusRef.current[userId]) {
          console.log('called in offer')
          peer.signal(signalData)
        } else if (signalData.type === 'answer' && initiatorStatusRef.current[userId]) {
          console.log('called in answer')
          peer.signal(signalData)
        } else if (signalData.type === 'candidate') {
          console.log('called in candidate')
          peer.signal(signalData)
        }
      } catch (err) {
        console.error('Error handling signal:', err)
        removePeer(userId)
      }
    }
    const handleUserDisconnected = (userId: string) => {
      console.log('User disconnected:', userId)
      removePeer(userId)
    }

    connection.on('userConnected', handleUserConnected)
    connection.on('receiveSignal', handleReceiveSignal)
    connection.on('userDisconnected', handleUserDisconnected)

    return () => {
      connection.off('userConnected', handleUserConnected)
      connection.off('receiveSignal', handleReceiveSignal)
      connection.off('userDisconnected', handleUserDisconnected)
    }
  }, [connection, stream, roomId])

  return (
    <div className='flex h-screen bg-black text-white'>
      <div className='flex flex-1 flex-col'>
        {/* Main video area */}
        <div className='relative flex-1'>
          <video autoPlay playsInline ref={localVideoRef} className='h-full w-full object-cover' />
          <div className='absolute bottom-4 left-4 rounded bg-black bg-opacity-50 px-2 py-1'>John Doe</div>
        </div>

        {/* Call controls */}
        <div className='flex h-20 items-center justify-center space-x-4 bg-gray-900'>
          <Button
            variant='outline'
            size='icon'
            className='rounded-full border-gray-600 bg-gray-800 text-white hover:bg-gray-700'
            onClick={toggleAudio}
          >
            {isAudioEnabled ? <Mic className='h-6 w-6' /> : <MicOff className='h-6 w-6' />}
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='rounded-full border-gray-600 bg-gray-800 text-white hover:bg-gray-700'
            onClick={toggleVideo}
          >
            {isVideoEnabled ? <Video className='h-6 w-6' /> : <VideoOff className='h-6 w-6' />}
          </Button>
          <Button variant='destructive' size='icon' className='rounded-full bg-red-500 text-white hover:bg-red-600'>
            <PhoneOff className='h-6 w-6' />
          </Button>
        </div>
      </div>

      {/* Sidebar with participant thumbnails */}
      <div className='w-96 overflow-y-auto bg-gray-900 p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-bold'>Participants ({Object.keys(remoteStreams).length})</h2>
          <Users className='h-5 w-5' />
        </div>
        {Object.entries(remoteStreams).map(([userId, remoteStream]) => (
          <Card key={userId} className='mb-4 overflow-hidden bg-gray-800'>
            <video
              autoPlay
              playsInline
              ref={(element) => {
                if (element) element.srcObject = remoteStream
              }}
              className='h-36 w-full object-cover'
            />
          </Card>
        ))}
      </div>
    </div>
  )
}
