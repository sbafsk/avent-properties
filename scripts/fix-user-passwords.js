const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Environment check:')
console.log('URL:', supabaseUrl ? '✅ Found' : '❌ Missing')
console.log('Service Key:', supabaseServiceKey ? '✅ Found' : '❌ Missing')

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixUserPasswords() {
  console.log('🔧 Fixing user passwords...')

  const users = [
    {
      email: 'admin@aventproperties.com',
      password: 'admin123456',
      role: 'ADMIN'
    },
    {
      email: 'client@example.com', 
      password: 'client123456',
      role: 'CLIENT'
    },
    {
      email: 'agency@luxuryestates.uy',
      password: 'agency123456', 
      role: 'AGENCY'
    }
  ]

  for (const user of users) {
    try {
      console.log(`\n📧 Processing: ${user.email}`)
      
      // First, check if user exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error(`❌ Error fetching user ${user.email}:`, fetchError.message)
        continue
      }

      if (!existingUser) {
        console.log(`⚠️  User ${user.email} not found in users table, creating...`)
        
        // Create user in auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            role: user.role
          }
        })

        if (authError) {
          console.error(`❌ Error creating auth user ${user.email}:`, authError.message)
          continue
        }

        // Create user in users table
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: user.email,
            name: `${user.role} User`,
            role: user.role
          })

        if (insertError) {
          console.error(`❌ Error inserting user ${user.email}:`, insertError.message)
          continue
        }

        console.log(`✅ Created user: ${user.email}`)
      } else {
        console.log(`✅ User ${user.email} already exists`)
        console.log(`📋 User ID: ${existingUser.id}`)
        
        // Try to find the auth user by email instead of ID
        const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers()
        
        if (listError) {
          console.error(`❌ Error listing auth users:`, listError.message)
          continue
        }
        
        const authUser = authUsers.users.find(u => u.email === user.email)
        
        if (!authUser) {
          console.log(`⚠️  Auth user not found for ${user.email}, creating...`)
          
          // Create auth user
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: user.email,
            password: user.password,
            email_confirm: true,
            user_metadata: {
              role: user.role
            }
          })

          if (authError) {
            console.error(`❌ Error creating auth user ${user.email}:`, authError.message)
            continue
          }
          
          console.log(`✅ Created auth user: ${user.email}`)
        } else {
          console.log(`✅ Auth user found for ${user.email}`)
          
          // Update password using the auth user ID
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            authUser.id,
            { password: user.password }
          )

          if (updateError) {
            console.error(`❌ Error updating password for ${user.email}:`, updateError.message)
          } else {
            console.log(`✅ Updated password for: ${user.email}`)
          }
        }
      }
    } catch (error) {
      console.error(`❌ Unexpected error for ${user.email}:`, error.message)
    }
  }

  console.log('\n🎉 Password fix completed!')
}

fixUserPasswords().catch(console.error)
