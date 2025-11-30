// ============================================
// CREATE ADMIN USER VIA SUPABASE API
// ============================================
// Run this script: node create_admin_user_api.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // You need to add this to .env

async function createAdminUser() {
  console.log('🚀 Creating admin user...\n')

  // Initialize Supabase Admin Client
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    // Step 1: Create Auth User
    console.log('📧 Creating Supabase Auth user...')
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'sudanva20@gmail.com',
      password: '123456',
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: 'Sudanva (Admin)'
      }
    })

    if (authError) {
      // Check if user already exists
      if (authError.message.includes('already registered')) {
        console.log('⚠️  User already exists in auth system')
        console.log('✅ Proceeding to add admin privileges...\n')
      } else {
        throw authError
      }
    } else {
      console.log('✅ Auth user created successfully!')
      console.log('   User ID:', authData.user.id)
      console.log('   Email:', authData.user.email, '\n')
    }

    // Step 2: Add to admin_users table
    console.log('👑 Adding admin privileges...')
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .upsert([
        {
          email: 'sudanva20@gmail.com',
          role: 'super_admin',
          created_by: 'system'
        }
      ], { onConflict: 'email' })
      .select()

    if (adminError) throw adminError

    console.log('✅ Admin privileges granted!\n')

    // Verify
    const { data: verifyData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', 'sudanva20@gmail.com')
      .single()

    console.log('📋 Admin User Details:')
    console.log('   Email:', verifyData.email)
    console.log('   Role:', verifyData.role)
    console.log('   Created:', verifyData.created_at)
    console.log('\n🎉 Admin user created successfully!')
    console.log('\n🔐 Login Credentials:')
    console.log('   Email: sudanva20@gmail.com')
    console.log('   Password: 123456')
    console.log('\n✨ You can now login and access Admin Dashboard!')

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    process.exit(1)
  }
}

// Run the function
createAdminUser()
