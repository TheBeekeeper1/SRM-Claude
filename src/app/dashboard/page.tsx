'use client'

import { useEffect, useState } from 'react'
import { supabase, Supplier, ContactHistory, Delivery } from '@/lib/supabase'
import { ProtectedRoute } from '@/components/protected-route'
import Link from 'next/link'
import { formatDistanceToNow, parseISO, isBefore, addDays } from 'date-fns'
import { sv } from 'date-fns/locale'

type SupplierWithLatestContact = {
  id: string
  name: string
  company_name?: string
  email?: string
  phone?: string
  status: string
  latest_contact: ContactHistory | null
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total_suppliers: 0,
    pipeline_volume: 0,
    delivered_volume: 0,
  })
  const [suppliersToFollowUp, setSuppliersToFollowUp] = useState<SupplierWithLatestContact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)

        // Get total count of suppliers
        const { count: supplierCount } = await supabase
          .from('suppliers')
          .select('id', { count: 'exact' })
          .eq('status', 'active')

        // Get pipeline volume (sum of estimated_value from supply_opportunities)
        const { data: opportunities } = await supabase
          .from('supply_opportunities')
          .select('estimated_value')
          .eq('status', 'open')

        const pipelineVolume = opportunities?.reduce(
          (sum, opp) => sum + (opp.estimated_value || 0),
          0
        ) || 0

        // Get delivered volume (sum of price from deliveries in last 12 months)
        const yearAgo = new Date()
        yearAgo.setFullYear(yearAgo.getFullYear() - 1)

        const { data: deliveries } = await supabase
          .from('deliveries')
          .select('price')
          .gte('delivery_date', yearAgo.toISOString().split('T')[0])

        const deliveredVolume = deliveries?.reduce(
          (sum, del) => sum + (del.price || 0),
          0
        ) || 0

        setStats({
          total_suppliers: supplierCount || 0,
          pipeline_volume: pipelineVolume,
          delivered_volume: deliveredVolume,
        })

        // Get suppliers that need follow-up within 14 days
        const { data: suppliers } = await supabase
          .from('suppliers')
          .select('id, name, company_name, email, phone, status')
          .eq('status', 'active')

        if (suppliers) {
          const suppliersWithContact = await Promise.all(
            suppliers.map(async (supplier) => {
              const { data: contacts } = await supabase
                .from('contact_history')
                .select('*')
                .eq('supplier_id', supplier.id)
                .order('contact_date', { ascending: false })
                .limit(1)

              return {
                ...supplier,
                latest_contact: contacts?.[0] || null,
              }
            })
          )

          // Filter suppliers that need follow-up within 14 days
          const today = new Date()
          const twoWeeksFromNow = addDays(today, 14)

          const needsFollowUp = suppliersWithContact.filter((s) => {
            if (!s.latest_contact || !s.latest_contact.follow_up_date) return false
            const followUpDate = parseISO(s.latest_contact.follow_up_date)
            return (
              isBefore(followUpDate, twoWeeksFromNow) &&
              isBefore(today, followUpDate)
            )
          })

          setSuppliersToFollowUp(needsFollowUp)
        }
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                <p className="text-gray-600 text-sm font-medium">Pipeline-volym</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.pipeline_volume.toLocaleString('sv-SE', {
                    style: 'currency',
                    currency: 'SEK',
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
              <span className="text-4xl">📈</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Levererad Volym (12m)</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.delivered_volume.toLocaleString('sv-SE', {
                    style: 'currency',
                    currency: 'SEK',
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
              <span className="text-4xl">📦</span>
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
              Leverantörer som behöver följas upp inom 14 dagar
            </p>
          </div>

          {suppliersToFollowUp.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Namn
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Företag
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Senaste Kontakt
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Uppföljningsdatum
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
                        {supplier.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {supplier.company_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {supplier.latest_contact?.contact_date
                          ? formatDistanceToNow(
                              parseISO(supplier.latest_contact.contact_date),
                              {
                                addSuffix: true,
                                locale: sv,
                              }
                            )
                          : 'Ingen kontakt'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {supplier.latest_contact?.follow_up_date ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {new Date(
                              supplier.latest_contact.follow_up_date
                            ).toLocaleDateString('sv-SE')}
                          </span>
                        ) : (
                          '-'
                        )}
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
