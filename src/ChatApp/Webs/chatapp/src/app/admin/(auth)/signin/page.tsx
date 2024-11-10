'use client'

import AdminSigninForm from '@/components/admin/signin/admin-signin-form'
import { useSearchParams } from 'next/navigation'

export default function SigninPage() {
  const searchParams = useSearchParams()
  const initialError = searchParams.get('error')
  
  return <AdminSigninForm initialError={initialError || undefined} />
}

