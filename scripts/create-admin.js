// Create Admin User Script
// Run this in your browser console on the signup page

const createAdminUser = async () => {
  const supabaseUrl = 'https://waiuluclvrdfkjnelssg.supabase.co'
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhaXVsdWNsdnJkZmtqbmVsc3NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5OTE1NDIsImV4cCI6MjA3MTU2NzU0Mn0.97nMCiANVEHvZDXWCkHvc22d-l1pcwcG3nswf9Vjfeo'

  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2')

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@aventproperties.com',
      password: 'admin123456',
      options: {
        data: {
          first_name: 'Admin',
          last_name: 'User',
          role: 'ADMIN',
        }
      }
    })

    if (error) {
      console.error('Error creating admin user:', error)
    } else {
      console.log('Admin user created successfully:', data)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the function
createAdminUser()
