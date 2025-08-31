#!/usr/bin/env node

/**
 * Authentication Testing Script for Avent Properties
 * Tests all authentication functionality including sign up, sign in, sign out, and role-based access control
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please check your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test users data
const testUsers = {
  admin: {
    email: 'admin@aventproperties.com',
    password: 'admin123456',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+1234567890',
    location: 'Dubai, UAE',
    company: 'Avent Properties',
    role: 'ADMIN'
  },
  client: {
    email: 'client@example.com',
    password: 'client123456',
    firstName: 'John',
    lastName: 'Client',
    phone: '+1234567891',
    location: 'Dubai, UAE',
    company: 'Tech Corp',
    role: 'CLIENT'
  },
  agency: {
    email: 'agency@luxuryestates.uy',
    password: 'agency123456',
    firstName: 'Maria',
    lastName: 'Agency',
    phone: '+59812345678',
    location: 'Punta del Este, Uruguay',
    company: 'Luxury Estates Uruguay',
    role: 'AGENCY'
  }
}

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
}

function logTest(name, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL'
  const message = `${status} ${name}`
  console.log(message)
  if (details) {
    console.log(`   ${details}`)
  }
  
  testResults.tests.push({ name, passed, details })
  if (passed) {
    testResults.passed++
  } else {
    testResults.failed++
  }
}

async function testSignUp() {
  console.log('\n🔐 Testing User Registration...')
  
  for (const [role, userData] of Object.entries(testUsers)) {
    try {
      console.log(`\n📝 Testing ${role} registration...`)
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            location: userData.location,
            company: userData.company,
            role: userData.role,
          }
        }
      })
      
      if (error) {
        if (error.message.includes('already registered')) {
          logTest(`${role} registration`, true, 'User already exists (expected)')
        } else {
          logTest(`${role} registration`, false, error.message)
        }
      } else {
        logTest(`${role} registration`, true, 'User created successfully')
      }
    } catch (error) {
      logTest(`${role} registration`, false, error.message)
    }
  }
}

async function testSignIn() {
  console.log('\n🔑 Testing User Sign In...')
  
  for (const [role, userData] of Object.entries(testUsers)) {
    try {
      console.log(`\n🔐 Testing ${role} sign in...`)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password,
      })
      
      if (error) {
        logTest(`${role} sign in`, false, error.message)
      } else {
        logTest(`${role} sign in`, true, `Signed in as ${data.user.email}`)
        
        // Test session retrieval
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          logTest(`${role} session retrieval`, false, sessionError.message)
        } else {
          logTest(`${role} session retrieval`, true, 'Session retrieved successfully')
        }
        
        // Test user data retrieval
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError) {
          logTest(`${role} user data retrieval`, false, userError.message)
        } else {
          logTest(`${role} user data retrieval`, true, `User data: ${userData.user.email}`)
          
          // Check user metadata - fix the role verification logic
          const metadata = userData.user.user_metadata
          console.log(`   Debug - User metadata:`, JSON.stringify(metadata, null, 2))
          
          const actualRole = metadata.role
          const expectedRole = testUsers[role].role
          
          if (actualRole === expectedRole) {
            logTest(`${role} role verification`, true, `Role: ${actualRole}`)
          } else {
            logTest(`${role} role verification`, false, `Expected: ${expectedRole}, Got: ${actualRole}`)
          }
        }
      }
    } catch (error) {
      logTest(`${role} sign in`, false, error.message)
    }
  }
}

async function testSignOut() {
  console.log('\n🚪 Testing User Sign Out...')
  
  try {
    // First sign in as admin
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testUsers.admin.email,
      password: testUsers.admin.password,
    })
    
    if (signInError) {
      logTest('sign out preparation', false, 'Could not sign in to test sign out')
      return
    }
    
    // Test sign out
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      logTest('sign out', false, error.message)
    } else {
      logTest('sign out', true, 'Signed out successfully')
      
      // Verify session is cleared
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        logTest('session clearing', true, 'Session cleared after sign out')
      } else {
        logTest('session clearing', false, 'Session still exists after sign out')
      }
    }
  } catch (error) {
    logTest('sign out', false, error.message)
  }
}

async function testPasswordReset() {
  console.log('\n🔒 Testing Password Reset...')
  
  try {
    // Use a valid email format for testing
    const { error } = await supabase.auth.resetPasswordForEmail('test@aventproperties.com', {
      redirectTo: 'http://localhost:3000/auth/reset-password',
    })
    
    if (error) {
      logTest('password reset request', false, error.message)
    } else {
      logTest('password reset request', true, 'Password reset email sent')
    }
  } catch (error) {
    logTest('password reset request', false, error.message)
  }
}

async function testProtectedRoutes() {
  console.log('\n🛡️ Testing Protected Routes...')
  
  // Test without authentication
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      logTest('unauthenticated access', true, 'No user session (expected)')
    } else {
      logTest('unauthenticated access', false, 'User session exists when not expected')
    }
  } catch (error) {
    logTest('unauthenticated access', false, error.message)
  }
  
  // Test with authentication
  try {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testUsers.admin.email,
      password: testUsers.admin.password,
    })
    
    if (signInError) {
      logTest('authenticated access', false, 'Could not sign in to test authenticated access')
    } else {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        logTest('authenticated access', false, 'No user session after sign in')
      } else {
        logTest('authenticated access', true, `Authenticated as ${user.email}`)
        
        // Test role-based access - fix the role verification
        const metadata = user.user_metadata
        const actualRole = metadata.role
        const expectedRole = 'ADMIN'
        
        if (actualRole === expectedRole) {
          logTest('admin role access', true, 'Admin role verified')
        } else {
          logTest('admin role access', false, `Expected ${expectedRole} role, got ${actualRole}`)
        }
      }
    }
  } catch (error) {
    logTest('authenticated access', false, error.message)
  }
}

async function testDatabaseConnection() {
  console.log('\n🗄️ Testing Database Connection...')
  
  try {
    // Test basic database connection
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (error) {
      logTest('database connection', false, error.message)
    } else {
      logTest('database connection', true, 'Database connection successful')
    }
  } catch (error) {
    logTest('database connection', false, error.message)
  }
}

async function runAllTests() {
  console.log('🚀 Starting Authentication Tests for Avent Properties')
  console.log('=' .repeat(60))
  
  await testDatabaseConnection()
  await testSignUp()
  await testSignIn()
  await testSignOut()
  await testPasswordReset()
  await testProtectedRoutes()
  
  // Print summary
  console.log('\n' + '=' .repeat(60))
  console.log('📊 Test Summary')
  console.log('=' .repeat(60))
  console.log(`✅ Passed: ${testResults.passed}`)
  console.log(`❌ Failed: ${testResults.failed}`)
  console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`)
  
  if (testResults.failed > 0) {
    console.log('\n❌ Failed Tests:')
    testResults.tests
      .filter(test => !test.passed)
      .forEach(test => {
        console.log(`   - ${test.name}: ${test.details}`)
      })
  }
  
  console.log('\n🎯 Next Steps:')
  if (testResults.failed === 0) {
    console.log('✅ All authentication tests passed! Ready for component integration.')
  } else {
    console.log('🔧 Fix failed tests before proceeding to component integration.')
  }
}

// Run tests
runAllTests().catch(console.error)
