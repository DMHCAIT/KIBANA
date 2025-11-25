/**
 * Script to create an admin user
 * 
 * Usage:
 * 1. Make sure you have your Supabase credentials in .env.local
 * 2. Run: node scripts/create-admin.js <email> <password> <full_name>
 * 
 * Example:
 * node scripts/create-admin.js admin@kibana.com "SecurePassword123" "Admin User"
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser(email, password, fullName = 'Admin User') {
  try {
    console.log('🔄 Creating admin user...')
    
    // Step 1: Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    })

    if (authError) {
      console.error('❌ Error creating auth user:', authError.message)
      return
    }

    console.log('✅ Auth user created:', authData.user.id)

    // Step 2: Create/Update user in users table with admin role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert({
        id: authData.user.id,
        email: email,
        full_name: fullName,
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      })
      .select()
      .single()

    if (userError) {
      console.error('❌ Error creating user record:', userError.message)
      console.log('⚠️  Auth user created but user record failed. You may need to manually update the users table.')
      return
    }

    console.log('✅ Admin user created successfully!')
    console.log('\n📋 Admin Credentials:')
    console.log('   Email:', email)
    console.log('   Password:', password)
    console.log('   Role: admin')
    console.log('\n🔗 Login at: http://localhost:3000/admin/login')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

// Get command line arguments
const args = process.argv.slice(2)

if (args.length < 2) {
  console.log('Usage: node scripts/create-admin.js <email> <password> [full_name]')
  console.log('Example: node scripts/create-admin.js admin@kibana.com "SecurePassword123" "Admin User"')
  process.exit(1)
}

const [email, password, fullName] = args

createAdminUser(email, password, fullName || 'Admin User')

