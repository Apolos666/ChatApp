'use client'

import Loading from '@/app/(auth)/loading'
import { useAuthCheck } from '@/hooks/use-auth-check'

export default function RoomsPage() {
  const { isChecking } = useAuthCheck()

  if (isChecking) return <Loading />
  return <div>RoomsPage</div>
}
