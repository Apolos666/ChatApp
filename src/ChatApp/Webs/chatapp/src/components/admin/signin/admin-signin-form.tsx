'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { httpGet } from '@/services/user.service.api/_req'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'
import { LoginForm } from './login-form'
import { LoadingSpinner } from './loading-spinner'

export default function AdminSigninForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const token = getLocalStorageItem(PersistedStateKey.Token)
        if (!token) {
          setIsChecking(false)
          return
        }

        const response = await httpGet('/user/profile')
        if (response.status === 200 && response.data.role.id === 1) {
          router.push('/admin/dashboard')
          return
        }
        
        setIsChecking(false)
      } catch (err) {
        setIsChecking(false)
      }
    }

    checkAdminAuth()
  }, [router])

  if (isChecking) {
    return <LoadingSpinner />
  }

  return (
    <div className='relative min-h-screen'>
      <div className='flex min-h-screen items-center justify-center bg-gray-50/50 px-4 py-12 sm:px-6 lg:px-8'>
        <div className='w-full max-w-md space-y-8'>
          <Card className='w-full border-gray-200 shadow-xl'>
            <CardHeader className='space-y-2 pb-6'>
              <CardTitle className='text-center text-2xl font-bold'>Admin Login</CardTitle>
              <p className='text-center text-sm text-muted-foreground'>
                Enter your credentials to access the admin panel
              </p>
            </CardHeader>
            <CardContent>
              <LoginForm error={error} setError={setError} onSuccess={() => router.push('/admin/dashboard')} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
