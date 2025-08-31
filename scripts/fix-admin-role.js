#!/usr/bin/env node

/**
 * Fix Admin User Role Script
 * Updates the admin user's metadata to include the correct role
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function fixAdminRole() {
  console.log('🔧 Fixing Admin User Role...')
  
  try {
    // First, sign in as admin
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@aventproperties.com',
      password: 'admin123456',
    })
    
    if (signInError) {
      console.error('❌ Could not sign in as admin:', signInError.message)
      return
    }
    
    console.log('✅ Signed in as admin')
    
    // Get current user data
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('❌ Could not get user data:', userError.message)
      return
    }
    
    console.log('📋 Current user metadata:', JSON.stringify(user.user_metadata, null, 2))
    
    // Update user metadata to include role
    const { data: updateData, error: updateError } = await supabase.auth.updateUser({
      data: {
        role: 'ADMIN',
        first_name: 'Admin',
        last_name: 'User',
        phone: '+1234567890',
        location: 'Dubai, UAE',
        company: 'Avent Properties',
      }
    })
    
    if (updateError) {
      console.error('❌ Could not update user metadata:', updateError.message)
      return
    }
    
    console.log('✅ Updated admin user metadata')
    console.log('📋 New user metadata:', JSON.stringify(updateData.user.user_metadata, null, 2))
    
    // Verify the update
    const { data: { user: updatedUser }, error: verifyError } = await supabase.auth.getUser()
    
    if (verifyError) {
      console.error('❌ Could not verify update:', verifyError.message)
      return
    }
    
    if (updatedUser.user_metadata.role === 'ADMIN') {
      console.log('✅ Admin role successfully set!')
    } else {
      console.log('❌ Admin role not set correctly')
    }
    
  } catch (error) {
    console.error('❌ Error fixing admin role:', error.message)
  }
}

fixAdminRole()






