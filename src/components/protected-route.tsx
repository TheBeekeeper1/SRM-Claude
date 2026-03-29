'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <p className="mt-4 text-gray-600">Laddar...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return <>{children}</>
}
