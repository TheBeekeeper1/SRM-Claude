#!/usr/bin/env node

/**
 * Direct Database Migration Script
 * Runs SQL schema directly against Supabase using admin client
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function runMigration() {
  console.log('🍯 Honey SRM - Database Migration\n')

  // Get credentials
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    console.error('❌ Error: Missing required environment variables:')
    console.error('   NEXT_PUBLIC_SUPABASE_URL')
    console.error('   SUPABASE_SERVICE_ROLE_KEY')
    console.error('\n💡 For manual setup, see setup-db.js\n')
    process.exit(1)
  }

  console.log('✅ Environment variables found')
  console.log('📍 Connecting to Supabase...\n')

  try {
    const supabase = createClient(url, serviceKey, {
      db: { schema: 'public' },
    })

    // Read schema
    const schemaPath = path.join(__dirname, 'supabase-schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf-8')

    console.log('📄 Running migration...\n')

    // Execute the entire schema as one statement
    const { data, error } = await supabase.rpc('exec', {
      sql: schema,
    })

    if (error) {
      console.error('❌ Migration error:', error)
      process.exit(1)
    }

    console.log('✅ Migration completed successfully!\n')
    console.log('📊 Database tables created:')
    console.log('   ✓ suppliers')
    console.log('   ✓ contact_history')
    console.log('   ✓ supply_opportunities')
    console.log('   ✓ deliveries\n')
    console.log('🎉 Ready to use!\n')

  } catch (error) {
    console.error('❌ Connection error:', error.message)
    console.error('\n📖 Troubleshooting:')
    console.error('1. Verify SUPABASE_SERVICE_ROLE_KEY is correctly set')
    console.error('2. Check that your Supabase project is active')
    console.error('3. Try manual migration via Supabase Dashboard (see setup-db.js)\n')
    process.exit(1)
  }
}

runMigration()
