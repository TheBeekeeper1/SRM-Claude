'use client'

import { useEffect, useState } from 'react'
import { supabase, Supplier } from '@/lib/supabase'
import { ProtectedRoute } from '@/components/protected-route'
import Link from 'next/link'

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('suppliers')
          .select('*')
          .order('name', { ascending: true })

        if (fetchError) throw fetchError

        setSuppliers(data || [])

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set((data || []).map((s) => s.category).filter(Boolean))
        ) as string[]
        setCategories(uniqueCategories.sort())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Load suppliers error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadSuppliers()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = suppliers

    // Search filter
    if (searchText) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchText.toLowerCase()) ||
          (s.company_name && s.company_name.toLowerCase().includes(searchText.toLowerCase())) ||
          (s.email && s.email.toLowerCase().includes(searchText.toLowerCase()))
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((s) => s.status === statusFilter)
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((s) => s.category === categoryFilter)
    }

    setFilteredSuppliers(filtered)
  }, [suppliers, searchText, statusFilter, categoryFilter])

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Leverantörer</h1>
          <Link
            href="/suppliers/new"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition"
          >
            + Ny Leverantör
          </Link>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
              <p className="mt-4 text-gray-600">Laddar leverantörer...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <input
                type="text"
                placeholder="Sök efter namn, företag eller email..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              >
                <option value="all">Alla Status</option>
                <option value="active">Aktiv</option>
                <option value="inactive">Inaktiv</option>
                <option value="prospect">Prospect</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              >
                <option value="all">Alla Kategorier</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Results */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {filteredSuppliers.length > 0 ? (
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
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Kategori
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                          Åtgärd
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredSuppliers.map((supplier) => (
                        <tr key={supplier.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {supplier.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {supplier.company_name || '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {supplier.email || '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {supplier.category || '-'}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                supplier.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : supplier.status === 'inactive'
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {supplier.status === 'active'
                                ? 'Aktiv'
                                : supplier.status === 'inactive'
                                  ? 'Inaktiv'
                                  : 'Prospect'}
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
                <div className="p-12 text-center text-gray-600">
                  <p className="text-lg mb-2">Inga leverantörer matchade din sökning</p>
                  <p className="text-sm">Försök med andra sökord eller filter</p>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center text-gray-600 text-sm">
              Visar {filteredSuppliers.length} av {suppliers.length} leverantörer
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  )
}
