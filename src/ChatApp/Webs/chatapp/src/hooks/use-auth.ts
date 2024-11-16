'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLocalStorageItem, removeLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'
import { httpGetPrivate } from '@/services/user.service.api/_req'
import { User } from '@/types/user'

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getLocalStorageItem(PersistedStateKey.Token)
        
        if (!token) {
          setUser(null)
          setIsLoading(false)
          return
        }

        const response = await httpGetPrivate('/user/profile')
        setUser(response.data)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching user profile", err)
        setUser(null)
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const logout = () => {
    removeLocalStorageItem(PersistedStateKey.Token)
    setUser(null)
    router.push('/admin/signin')
  }

  return { user, logout, isLoading }
}
