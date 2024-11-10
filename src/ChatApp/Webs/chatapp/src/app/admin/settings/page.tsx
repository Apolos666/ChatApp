'use client'

import Loading from '@/app/(auth)/loading'
import { useAuthCheck } from '@/hooks/use-auth-check'

export default function SettingsPage() {
  const { isChecking } = useAuthCheck()

  if (isChecking) return <Loading />
  return <div>SettingsPage</div>
}

