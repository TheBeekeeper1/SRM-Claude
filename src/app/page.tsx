'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        <p className="mt-4 text-gray-600">Laddar...</p>
      </div>
    </div>
  )
}
