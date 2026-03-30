'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  supabase,
  Supplier,
  ContactHistory,
  SupplyOpportunity,
  Delivery,
} from '@/lib/supabase'
import { ProtectedRoute } from '@/components/protected-route'

export default function SupplierDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supplierId = params.id as string

  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [contacts, setContacts] = useState<ContactHistory[]>([])
  const [opportunities, setOpportunities] = useState<SupplyOpportunity[]>([])
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form states
  const [showNewContact, setShowNewContact] = useState(false)
  const [newContact, setNewContact] = useState({
    contact_type: 'meeting',
    notes: '',
    follow_up_date: '',
  })

  useEffect(() => {
    const loadSupplierData = async () => {
      try {
        setLoading(true)

        // Load supplier
        const { data: supplierData, error: supplierError } = await supabase
          .from('suppliers')
          .select('*')
          .eq('id', supplierId)
          .single()

        if (supplierError) throw supplierError
        setSupplier(supplierData)

        // Load contact history
        const { data: contactData } = await supabase
          .from('contact_history')
          .select('*')
          .eq('supplier_id', supplierId)
          .order('contact_date', { ascending: false })

        setContacts(contactData || [])

        // Load opportunities
        const { data: oppData } = await supabase
          .from('supply_opportunities')
          .select('*')
          .eq('supplier_id', supplierId)
          .order('opportunity_date', { ascending: false })

        setOpportunities(oppData || [])

        // Load deliveries
        const { data: delData } = await supabase
          .from('deliveries')
          .select('*')
          .eq('supplier_id', supplierId)
          .order('delivery_date', { ascending: false })

        setDeliveries(delData || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Load supplier error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadSupplierData()
  }, [supplierId])

  const handleAddContact = async () => {
    try {
      const { error: insertError } = await supabase.from('contact_history').insert([
        {
          supplier_id: supplierId,
          contact_date: new Date().toISOString(),
          contact_type: newContact.contact_type,
          notes: newContact.notes,
          follow_up_date: newContact.follow_up_date || null,
        },
      ])

      if (insertError) throw insertError

      // Reload contacts
      const { data: contactData } = await supabase
        .from('contact_history')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('contact_date', { ascending: false })

      setContacts(contactData || [])
      setShowNewContact(false)
      setNewContact({
        contact_type: 'meeting',
        notes: '',
        follow_up_date: '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add contact')
      console.error('Add contact error:', err)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            <p className="mt-4 text-gray-600">Laddar leverantörsdetaljer...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!supplier) {
    return (
      <ProtectedRoute>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600 font-medium">Leverantören hittades inte</p>
            <button
              onClick={() => router.push('/suppliers')}
              className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg"
            >
              Tillbaka till leverantörer
            </button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{supplier.company_name}</h1>
            <p className="text-gray-600 mt-1">{supplier.contact_person || 'Ingen kontaktperson registrerad'}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/suppliers/${supplierId}/edit`)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition"
            >
              Redigera
            </button>
            <button
              onClick={() => router.push('/suppliers')}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
            >
              ← Tillbaka
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Supplier Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Kontaktuppgifter</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-900">{supplier.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Telefon</p>
                <p className="text-gray-900">{supplier.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Plats</p>
                <p className="text-gray-900">{supplier.location || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Kategori</p>
                <p className="text-gray-900">{supplier.category || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Webbsida</p>
                {supplier.url ? (
                  <p>
                    <a
                      href={supplier.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:text-amber-700 underline"
                    >
                      {supplier.url}
                    </a>
                  </p>
                ) : (
                  <p className="text-gray-900">-</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Volymuppgifter</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Status</p>
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
              </div>
              <div>
                <p className="text-sm text-gray-600">Antal bisamhällen</p>
                <p className="text-gray-900">{supplier.num_bee_colonies || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Potentiell volym (kg)</p>
                <p className="text-gray-900">
                  {supplier.potential_volume ? supplier.potential_volume.toLocaleString('sv-SE') : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bekräftad volym (kg)</p>
                <p className="text-gray-900">
                  {supplier.confirmed_volume ? supplier.confirmed_volume.toLocaleString('sv-SE') : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Kontakthistorik</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Datum senaste kontakt</p>
                <p className="text-gray-900">
                  {supplier.last_contact_date
                    ? new Date(supplier.last_contact_date).toLocaleDateString('sv-SE')
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Datum uppföljning</p>
                <p className="text-gray-900">
                  {supplier.follow_up_date
                    ? new Date(supplier.follow_up_date).toLocaleDateString('sv-SE')
                    : '-'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Anteckningar</h2>
            <div className="text-gray-900 whitespace-pre-wrap">{supplier.notes || '-'}</div>
          </div>
        </div>

        {/* Tabs content */}
        <div className="space-y-8">
          {/* Contact History */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Kontakthistorik</h2>
              <button
                onClick={() => setShowNewContact(!showNewContact)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition"
              >
                {showNewContact ? 'Avbryt' : '+ Ny Kontakt'}
              </button>
            </div>

            {showNewContact && (
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kontakttyp
                    </label>
                    <select
                      value={newContact.contact_type}
                      onChange={(e) =>
                        setNewContact({ ...newContact, contact_type: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="meeting">Möte</option>
                      <option value="call">Samtal</option>
                      <option value="email">Email</option>
                      <option value="other">Övrigt</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Anteckningar
                    </label>
                    <textarea
                      value={newContact.notes}
                      onChange={(e) =>
                        setNewContact({ ...newContact, notes: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Anteckningar från kontakten..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Uppföljningsdatum (valfritt)
                    </label>
                    <input
                      type="date"
                      value={newContact.follow_up_date}
                      onChange={(e) =>
                        setNewContact({ ...newContact, follow_up_date: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <button
                    onClick={handleAddContact}
                    className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition"
                  >
                    Spara Kontakt
                  </button>
                </div>
              </div>
            )}

            {contacts.length > 0 ? (
              <div className="p-6 space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="border-l-4 border-amber-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {contact.contact_type}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(contact.contact_date).toLocaleDateString('sv-SE')}
                        </p>
                      </div>
                      {contact.follow_up_date && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Uppfljning: {new Date(contact.follow_up_date).toLocaleDateString('sv-SE')}
                        </span>
                      )}
                    </div>
                    {contact.notes && (
                      <p className="text-gray-700 text-sm mt-2">{contact.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-600">Ingen kontakthistorik ännu</div>
            )}
          </div>

          {/* Supply Opportunities */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Supply Opportunities</h2>
            </div>

            {opportunities.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Beskrivning
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Volym
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Värde
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Datum
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {opportunities.map((opp) => (
                      <tr key={opp.id}>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {opp.description}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              opp.status === 'open'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {opp.status === 'open' ? 'Öppen' : 'Stängd'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {opp.estimated_volume || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {opp.estimated_value
                            ? opp.estimated_value.toLocaleString('sv-SE', {
                                style: 'currency',
                                currency: 'SEK',
                              })
                            : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(opp.opportunity_date).toLocaleDateString('sv-SE')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-600">Inga opportunities</div>
            )}
          </div>

          {/* Deliveries */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Leveranser</h2>
            </div>

            {deliveries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Datum
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Kvantitet
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Enhet
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Pris
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Anteckningar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {deliveries.map((delivery) => (
                      <tr key={delivery.id}>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(delivery.delivery_date).toLocaleDateString('sv-SE')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {delivery.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {delivery.unit || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {delivery.price
                            ? delivery.price.toLocaleString('sv-SE', {
                                style: 'currency',
                                currency: 'SEK',
                              })
                            : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {delivery.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-600">Inga leveranser</div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
