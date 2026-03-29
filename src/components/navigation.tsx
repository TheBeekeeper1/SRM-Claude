'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (!user) {
    return null
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-amber-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg hover:text-amber-200 transition">
              <span className="text-2xl">🍯</span>
              Honey SRM
            </Link>
            <div className="flex gap-6">
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive('/dashboard')
                    ? 'bg-amber-700 text-white'
                    : 'text-amber-100 hover:bg-amber-700'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/suppliers"
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive('/suppliers') || pathname.startsWith('/suppliers/')
                    ? 'bg-amber-700 text-white'
                    : 'text-amber-100 hover:bg-amber-700'
                }`}
              >
                Leverantörer
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-amber-100">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-amber-700 hover:bg-red-600 rounded-md text-sm font-medium transition"
            >
              Logga ut
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
