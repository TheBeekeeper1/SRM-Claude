'use client'

import { useEffect, useState } from 'react'
import { supabase, Supplier } from '@/lib/supabase'
import { ProtectedRoute } from '@/components/protected-route'
import Link from 'next/link'

type SupplierFollowUp = {
  id: string
  company_name: string
  contact_person: string
  email: string
  potential_volume: number
  confirmed_volume: number
  follow_up_date: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total_suppliers: 0,
    potential_volume: 0,
    confirmed_volume: 0,
    follow_ups_needed: 0,
  })
  const [suppliersToFollowUp, setSuppliersToFollowUp] = useState<SupplierFollowUp[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)

        // Get all suppliers (not filtered by status)
        const { data: suppliers, count: supplierCount, error: suppliersError } = await supabase
          .from('suppliers')
          .select('*', { count: 'exact' })

        if (suppliersError) throw suppliersError

        // Calculate stats from suppliers table
        let potentialVolume = 0
        let confirmedVolume = 0
        const needsFollowUpList: SupplierFollowUp[] = []
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const twoWeeksFromNow = new Date(today)
        twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14)

        if (suppliers) {
          suppliers.forEach((supplier) => {
            // Sum volumes
            if (supplier.potential_volume) {
              potentialVolume += supplier.potential_volume
            }
            if (supplier.confirmed_volume) {
              confirmedVolume += supplier.confirmed_volume
            }

            // Check if needs follow-up
            if (
              supplier.follow_up_date
            ) {
              const followUpDate = new Date(supplier.follow_up_date)
              followUpDate.setHours(0, 0, 0, 0)

              // Follow-up is needed if the date is within 14 days and not in the past
              if (followUpDate >= today && followUpDate <= twoWeeksFromNow) {
                needsFollowUpList.push({
                  id: supplier.id,
                  company_name: supplier.company_name,
                  contact_person: supplier.contact_person || '-',
                  email: supplier.email || '-',
                  potential_volume: supplier.potential_volume || 0,
                  confirmed_volume: supplier.confirmed_volume || 0,
                  follow_up_date: supplier.follow_up_date,
                })
              }
            }
          })
        }

        setStats({
          total_suppliers: supplierCount || 0,
          potential_volume: potentialVolume,
          confirmed_volume: confirmedVolume,
          follow_ups_needed: needsFollowUpList.length,
        })

        setSuppliersToFollowUp(needsFollowUpList.sort(
          (a, b) => new Date(a.follow_up_date).getTime() - new Date(b.follow_up_date).getTime()
        ))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Dashboard error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            <p className="mt-4 text-gray-600">Laddar data...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* KPI Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Antal Leverantörer</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.total_suppliers}
                </p>
              </div>
              <span className="text-4xl">👥</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Potentiell Volym</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.potential_volume.toLocaleString('sv-SE')} kg
                </p>
              </div>
              <span className="text-4xl">📈</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Bekräftad Volym</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.confirmed_volume.toLocaleString('sv-SE')} kg
                </p>
              </div>
              <span className="text-4xl">📦</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Uppföljningar (14d)</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.follow_ups_needed}
                </p>
              </div>
              <span className="text-4xl">📅</span>
            </div>
          </div>
        </div>

        {/* Follow-up List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Leverantörer att följa upp ({suppliersToFollowUp.length})
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Leverantörer med uppföljningsdatum inom 14 dagar
            </p>
          </div>

          {suppliersToFollowUp.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Företag
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Kontaktperson
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Potentiell (kg)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Bekräftad (kg)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Uppföljning
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Åtgärd
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {suppliersToFollowUp.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {supplier.company_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {supplier.contact_person}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {supplier.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {supplier.potential_volume.toLocaleString('sv-SE')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {supplier.confirmed_volume.toLocaleString('sv-SE')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {new Date(supplier.follow_up_date).toLocaleDateString('sv-SE')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <Link
                          href={`/suppliers/${supplier.id}`}
                          className="text-amber-600 hover:text-amber-700 font-medium"
                        >
                          Visa →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-600">
              Inga leverantörer behöver följas upp just nu
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
