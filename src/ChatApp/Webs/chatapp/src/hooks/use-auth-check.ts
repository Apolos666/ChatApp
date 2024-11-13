'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'
import { httpGetPrivate } from '@/services/user.service.api/_req'

export function useAuthCheck() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getLocalStorageItem(PersistedStateKey.Token)
        
        if (!token) {
          router.push('/admin/signin?error=Invalid%20credentials')
          return
        }

        // Check if user has admin role
        const response = await httpGetPrivate('/user/profile')
        if (response.data.role.id !== 1) {
          router.push('/admin/signin?error=Invalid%20credentials')
          return
        }

        setIsChecking(false)
      } catch (err) {
        // If any error occurs during check, redirect to signin
        router.push('/admin/signin?error=Invalid%20credentials')
      }
    }

    checkAuth()
  }, [router])

  return { isChecking }
}