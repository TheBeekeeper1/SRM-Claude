#!/usr/bin/env node

/**
 * Database Migration Setup
 * This script helps run the Supabase database schema migration
 */

const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

console.log('🍯 Honey SRM - Database Migration Script\n')

if (!supabaseUrl) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL not found in environment variables')
  process.exit(1)
}

if (!supabaseServiceKey) {
  console.warn('⚠️  Warning: SUPABASE_SERVICE_ROLE_KEY not found')
  console.warn('   Service role key is recommended for migrations')
  console.warn('   Without it, some operations may fail\n')
}

console.log('📍 Supabase URL:', supabaseUrl)
console.log('🔑 Service Key:', supabaseServiceKey ? '✅ Found' : '❌ Not found')
console.log()

// Read the schema file
const schemaPath = path.join(__dirname, 'supabase-schema.sql')
const schema = fs.readFileSync(schemaPath, 'utf-8')

console.log('📋 Options for running the migration:\n')

console.log('Option 1: Via Supabase Dashboard (Recommended for first-time setup)')
console.log('─'.repeat(70))
console.log('1. Go to https://app.supabase.com and open your project')
console.log('2. Navigate to SQL Editor')
console.log('3. Click "New Query"')
console.log('4. Paste the contents of supabase-schema.sql')
console.log('5. Click "Run"')
console.log()

console.log('Option 2: Via Supabase CLI')
console.log('─'.repeat(70))
console.log('1. Install Supabase CLI: npm install -g supabase')
console.log('2. Run: supabase link --project-ref PROJECT_REF')
console.log('3. Run: supabase db push')
console.log()

console.log('Option 3: Via SQL via REST API (with service role key)')
console.log('─'.repeat(70))

if (supabaseServiceKey) {
  const schemaBase64 = Buffer.from(schema).toString('base64')
  
  console.log('curl -X POST \\')
  console.log(`  "${supabaseUrl}/rest/v1/rpc/exec_sql" \\`)
  console.log('  -H "apikey: ' + supabaseServiceKey.substring(0, 10) + '..." \\')
  console.log('  -H "Content-Type: application/json" \\')
  console.log('  -d "{\\"sql\\": \\"[SQL CONTENT]\\"}"')
  console.log()
  console.log('(SQL content truncated for security - use dashboard for best experience)')
} else {
  console.log('Service role key not available - use Dashboard or CLI instead')
}

console.log()
console.log('📖 Database tables to be created:')
console.log('─'.repeat(70))
console.log('✓ suppliers             - Supplier information')
console.log('✓ contact_history       - Contact records with follow-up dates')
console.log('✓ supply_opportunities  - Potential supply opportunities')
console.log('✓ deliveries            - Historical delivery records')
console.log()

console.log('⚠️  Important Notes:')
console.log('─'.repeat(70))
console.log('• Row-Level Security (RLS) will be enabled on all tables')
console.log('• Only authenticated users will have access')
console.log('• Indexes are created for better query performance')
console.log('• existing tables will not be overwritten')
console.log()

console.log('💡 Recommendation: Use Supabase Dashboard for easiest setup!')
console.log()
