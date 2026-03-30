import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Supplier = {
  id: string
  company_name: string
  contact_person?: string
  email?: string
  phone?: string
  location?: string
  category?: string
  status: string
  url?: string
  num_bee_colonies?: number
  potential_volume?: number
  confirmed_volume?: number
  last_contact_date?: string
  follow_up_date?: string
  notes?: string
  honey_analysis?: string
  created_at: string
  updated_at: string
}

export type ContactHistory = {
  id: string
  supplier_id: string
  contact_date: string
  follow_up_date?: string
  contact_type?: string
  notes?: string
  created_at: string
  updated_at: string
}

export type SupplyOpportunity = {
  id: string
  supplier_id: string
  opportunity_date: string
  description?: string
  estimated_volume?: number
  estimated_value?: number
  status: string
  created_at: string
  updated_at: string
}

export type Delivery = {
  id: string
  supplier_id: string
  delivery_date: string
  quantity: number
  unit?: string
  price?: number
  notes?: string
  created_at: string
  updated_at: string
}
