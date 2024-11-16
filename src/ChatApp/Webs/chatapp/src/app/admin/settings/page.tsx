'use client'

import { Spinner } from '@/components/admin/shared/spinner'
import { useAuthCheck } from '@/hooks/use-auth-check'

export default function SettingsPage() {
  const { isChecking } = useAuthCheck()

  if (isChecking) return <Spinner size="lg" text="Loading..." className="justify-center mt-10"/>
  return <div>SettingsPage</div>
}

