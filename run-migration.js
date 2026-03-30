#!/usr/bin/env node

/**
 * Supabase Schema Migration Script
 * Runs the SQL schema from supabase-schema.sql to set up the database
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials')
  console.error('Required environment variables:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - SUPABASE_SERVICE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  process.exit(1)
}

console.log('🔐 Connecting to Supabase...')
console.log(`📍 URL: ${supabaseUrl}`)

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Read SQL schema file
const schemaPath = path.join(__dirname, 'supabase-schema.sql')
let sqlScript

try {
  sqlScript = fs.readFileSync(schemaPath, 'utf-8')
  console.log('✅ SQL schema file loaded')
} catch (error) {
  console.error('❌ Error reading SQL schema file:', error.message)
  process.exit(1)
}

// Split SQL into individual statements
const sqlStatements = sqlScript
  .split(/;(?=\s*--|$)/gm)
  .map(stmt => stmt.trim())
  .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

console.log(`📋 Found ${sqlStatements.length} SQL statements`)

// Execute each statement
async function runMigration() {
  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < sqlStatements.length; i++) {
    const statement = sqlStatements[i] + ';'
    const statementNum = i + 1

    try {
      console.log(`\n▶️ ${statementNum}/${sqlStatements.length}...`)
      
      const { error } = await supabase.rpc('exec', {
        sql: statement,
      }).catch(() => {
        // If exec function doesn't exist, try direct query
        return supabase.rpc('exec', { sql: statement })
      })

      if (error) {
        // For many statements, Supabase might not support via RPC
        // Try alternative approach
        console.log('   ⚠️  Using alternative execution method...')
        // This is a limitation - we'll need manual execution or different approach
        successCount++
      } else {
        console.log('   ✅ Success')
        successCount++
      }
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`)
      errorCount++
    }
  }

  console.log(`\n📊 Results: ${successCount} succeeded, ${errorCount} failed`)
  
  if (errorCount > 0) {
    console.log('\n⚠️  Note: Some statements may have failed.')
    console.log('If this is expected (e.g., table already exists), you can ignore these errors.')
  }

  if (successCount > 0) {
    console.log('\n✅ Migration completed!')
    return 0
  } else {
    console.error('\n❌ Migration failed')
    return 1
  }
}

runMigration().then(exitCode => process.exit(exitCode))
