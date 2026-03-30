'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase, Supplier } from '@/lib/supabase'
import { ProtectedRoute } from '@/components/protected-route'

export default function EditSupplierPage() {
  const params = useParams()
  const router = useRouter()
  const supplierId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<Supplier>({
    id: '',
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    location: '',
    category: '',
    url: '',
    status: 'active',
    num_bee_colonies: undefined,
    potential_volume: undefined,
    confirmed_volume: undefined,
    last_contact_date: undefined,
    follow_up_date: undefined,
    notes: '',
    honey_analysis: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  useEffect(() => {
    const loadSupplier = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('suppliers')
          .select('*')
          .eq('id', supplierId)
          .single()

        if (fetchError) throw fetchError
        if (data) {
          setForm({
            ...data,
            last_contact_date: data.last_contact_date || undefined,
            follow_up_date: data.follow_up_date || undefined,
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load supplier')
        console.error('Load error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadSupplier()
  }, [supplierId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.company_name.trim()) {
      setError('Företagsnamn krävs')
      return
    }

    setSaving(true)

    try {
      const { error: updateError } = await supabase
        .from('suppliers')
        .update({
          company_name: form.company_name,
          contact_person: form.contact_person || null,
          email: form.email || null,
          phone: form.phone || null,
          location: form.location || null,
          category: form.category || null,
          url: form.url || null,
          status: form.status,
          num_bee_colonies: form.num_bee_colonies ? Number(form.num_bee_colonies) : null,
          potential_volume: form.potential_volume ? Number(form.potential_volume) : null,
          confirmed_volume: form.confirmed_volume ? Number(form.confirmed_volume) : null,
          last_contact_date: form.last_contact_date || null,
          follow_up_date: form.follow_up_date || null,
          notes: form.notes || null,
          honey_analysis: form.honey_analysis || null,
        })
        .eq('id', supplierId)

      if (updateError) throw updateError

      router.push(`/suppliers/${supplierId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save supplier')
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Är du säker på att du vill ta bort denna leverantör?')) {
      return
    }

    setSaving(true)
    try {
      const { error: deleteError } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', supplierId)

      if (deleteError) throw deleteError
      router.push('/suppliers')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete supplier')
      console.error('Delete error:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            <p className="mt-4 text-gray-600">Laddar leverantör...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Redigera leverantör</h1>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Företag *</label>
              <input
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kontaktperson</label>
              <input
                name="contact_person"
                value={form.contact_person}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefon</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Webbsida</label>
              <input
                name="url"
                type="url"
                value={form.url}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ort</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kategori</label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Antal bisamhällen</label>
              <input
                name="num_bee_colonies"
                type="number"
                value={form.num_bee_colonies ?? ''}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Potentiell volym (kg)</label>
              <input
                name="potential_volume"
                type="number"
                step="0.01"
                value={form.potential_volume ?? ''}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bekräftad volym (kg)</label>
              <input
                name="confirmed_volume"
                type="number"
                step="0.01"
                value={form.confirmed_volume ?? ''}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Datum senaste kontakt</label>
              <input
                name="last_contact_date"
                type="date"
                value={form.last_contact_date ?? ''}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Datum uppföljning</label>
              <input
                name="follow_up_date"
                type="date"
                value={form.follow_up_date ?? ''}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="active">Aktiv</option>
                <option value="prospect">Prospect</option>
                <option value="inactive">Inaktiv</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Anteckningar</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Honungsanalys</label>
            <textarea
              name="honey_analysis"
              value={form.honey_analysis}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Ta bort leverantör
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push(`/suppliers/${supplierId}`)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Avbryt
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
              >
                {saving ? 'Sparar...' : 'Spara ändringar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  )
}
