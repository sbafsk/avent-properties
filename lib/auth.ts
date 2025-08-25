import { createClient } from '@/lib/supabase/client'

export interface AuthCredentials {
  email: string
  password: string
}

export interface SignUpData extends AuthCredentials {
  firstName: string
  lastName: string
  phone: string
  location: string
  company: string
}

export async function signUp(data: SignUpData) {
  const supabase = createClient()
  
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        location: data.location,
        company: data.company,
        role: 'CLIENT', // Default role for signups
      }
    }
  })

  if (error) {
    throw new Error(error.message)
  }

  return authData
}

export async function signIn(credentials: AuthCredentials) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function signOut() {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }
}

export async function getCurrentUser() {
  const supabase = createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    throw new Error(error.message)
  }

  return user
}

export async function getSession() {
  const supabase = createClient()
  
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    throw new Error(error.message)
  }

  return session
}

// Create admin user (for development)
export async function createAdminUser() {
  const supabase = createClient()
  
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
    throw new Error(error.message)
  }

  return data
}
