#!/usr/bin/env node

/**
 * Authenticated GraphQL API Testing Script for Avent Properties
 * Tests all GraphQL resolvers with proper authentication
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

// GraphQL endpoint
const GRAPHQL_ENDPOINT = 'http://localhost:3000/api/graphql'

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

async function getAuthToken() {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@aventproperties.com',
      password: 'admin123456',
    })
    
    if (error) {
      throw new Error(`Authentication failed: ${error.message}`)
    }
    
    return data.session.access_token
  } catch (error) {
    throw new Error(`Failed to get auth token: ${error.message}`)
  }
}

async function executeGraphQLQuery(query, variables = {}, headers = {}) {
  try {
    // Dynamic import for node-fetch
    const fetch = (await import('node-fetch')).default
    
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({
        query,
        variables
      })
    })
    
    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

async function testGraphQLEndpoint() {
  console.log('\n🌐 Testing GraphQL Endpoint...')
  
  try {
    const { data, error } = await executeGraphQLQuery(`
      query {
        __schema {
          types {
            name
          }
        }
      }
    `)
    
    if (error) {
      logTest('GraphQL endpoint availability', false, error)
    } else if (data.errors) {
      logTest('GraphQL endpoint availability', false, data.errors[0].message)
    } else {
      logTest('GraphQL endpoint availability', true, 'GraphQL endpoint is accessible')
    }
  } catch (error) {
    logTest('GraphQL endpoint availability', false, error.message)
  }
}

async function testPropertyQueries(authToken) {
  console.log('\n🏠 Testing Property Queries...')
  
  // Test getProperties query
  try {
    const { data, error } = await executeGraphQLQuery(`
      query GetProperties {
        properties {
          id
          title
          description
          price
          currency
          city
          neighborhood
          property_type
          bedrooms
          bathrooms
          area_m2
          amenities
          images
          status
          agency_id
          created_at
          updated_at
        }
      }
    `, {}, { 'Authorization': `Bearer ${authToken}` })
    
    if (error) {
      logTest('getProperties query (authenticated)', false, error)
    } else if (data.errors) {
      logTest('getProperties query (authenticated)', false, data.errors[0].message)
    } else {
      logTest('getProperties query (authenticated)', true, `Retrieved ${data.data.properties.length} properties`)
    }
  } catch (error) {
    logTest('getProperties query (authenticated)', false, error.message)
  }
  
  // Test getProperty query with first property ID
  try {
    const { data: propertiesData } = await executeGraphQLQuery(`
      query GetProperties {
        properties {
          id
          title
        }
      }
    `, {}, { 'Authorization': `Bearer ${authToken}` })
    
    if (propertiesData?.data?.properties?.length > 0) {
      const firstPropertyId = propertiesData.data.properties[0].id
      
      const { data, error } = await executeGraphQLQuery(`
        query GetProperty($id: ID!) {
          property(id: $id) {
            id
            title
            description
            price
            currency
            city
            neighborhood
            property_type
            bedrooms
            bathrooms
            area_m2
            amenities
            images
            status
            agency_id
            created_at
            updated_at
          }
        }
      `, { id: firstPropertyId }, { 'Authorization': `Bearer ${authToken}` })
      
      if (error) {
        logTest('getProperty query (authenticated)', false, error)
      } else if (data.errors) {
        logTest('getProperty query (authenticated)', false, data.errors[0].message)
      } else {
        logTest('getProperty query (authenticated)', true, `Retrieved property: ${data.data.property.title}`)
      }
    } else {
      logTest('getProperty query (authenticated)', false, 'No properties available to test with')
    }
  } catch (error) {
    logTest('getProperty query (authenticated)', false, error.message)
  }
}

async function testUserQueries(authToken) {
  console.log('\n👤 Testing User Queries...')
  
  // Test getUsers query
  try {
    const { data, error } = await executeGraphQLQuery(`
      query GetUsers {
        users {
          id
          email
          name
          role
          created_at
          updated_at
        }
      }
    `, {}, { 'Authorization': `Bearer ${authToken}` })
    
    if (error) {
      logTest('getUsers query (authenticated)', false, error)
    } else if (data.errors) {
      logTest('getUsers query (authenticated)', false, data.errors[0].message)
    } else {
      logTest('getUsers query (authenticated)', true, `Retrieved ${data.data.users.length} users`)
    }
  } catch (error) {
    logTest('getUsers query (authenticated)', false, error.message)
  }
}

async function testReservationQueries(authToken) {
  console.log('\n📅 Testing Reservation Queries...')
  
  // Test getReservations query
  try {
    const { data, error } = await executeGraphQLQuery(`
      query GetReservations {
        reservations {
          id
          user {
            id
            email
            name
          }
          property {
            id
            title
            city
          }
          scheduled_date
          deposit_amount
          status
          created_at
          updated_at
        }
      }
    `, {}, { 'Authorization': `Bearer ${authToken}` })
    
    if (error) {
      logTest('getReservations query (authenticated)', false, error)
    } else if (data.errors) {
      logTest('getReservations query (authenticated)', false, data.errors[0].message)
    } else {
      logTest('getReservations query (authenticated)', true, `Retrieved ${data.data.reservations.length} reservations`)
    }
  } catch (error) {
    logTest('getReservations query (authenticated)', false, error.message)
  }
}

async function testPropertyMutations(authToken) {
  console.log('\n✏️ Testing Property Mutations...')
  
  // Test createProperty mutation
  try {
    const { data, error } = await executeGraphQLQuery(`
      mutation CreateProperty($input: CreatePropertyInput!) {
        createProperty(input: $input) {
          id
          title
          description
          price
          currency
          city
          neighborhood
          property_type
          bedrooms
          bathrooms
          area_m2
          amenities
          images
          status
          agency_id
          created_at
          updated_at
        }
      }
    `, {
      input: {
        title: 'Test Luxury Villa - API Test',
        description: 'A beautiful test property for API testing',
        price: 1500000,
        currency: 'USD',
        city: 'Punta del Este',
        neighborhood: 'La Barra',
        property_type: 'Villa',
        bedrooms: 4,
        bathrooms: 3,
        area_m2: 250,
        amenities: ['Pool', 'Garden', 'Ocean View'],
        images: ['https://example.com/image1.jpg'],
        status: 'AVAILABLE',
        agency_id: '1'
      }
    }, { 'Authorization': `Bearer ${authToken}` })
    
    if (error) {
      logTest('createProperty mutation (authenticated)', false, error)
    } else if (data.errors) {
      logTest('createProperty mutation (authenticated)', false, data.errors[0].message)
    } else {
      logTest('createProperty mutation (authenticated)', true, `Property created: ${data.data.createProperty.title}`)
    }
  } catch (error) {
    logTest('createProperty mutation (authenticated)', false, error.message)
  }
}

async function testReservationMutations(authToken) {
  console.log('\n📝 Testing Reservation Mutations...')
  
  // Test createReservation mutation
  try {
    const { data, error } = await executeGraphQLQuery(`
      mutation CreateReservation($input: CreateReservationInput!) {
        createReservation(input: $input) {
          id
          user {
            id
            email
          }
          property {
            id
            title
          }
          scheduled_date
          deposit_amount
          status
          created_at
          updated_at
        }
      }
    `, {
      input: {
        user_id: '1',
        property_id: '1',
        scheduled_date: '2024-12-15T10:00:00Z',
        deposit_amount: 150000
      }
    }, { 'Authorization': `Bearer ${authToken}` })
    
    if (error) {
      logTest('createReservation mutation (authenticated)', false, error)
    } else if (data.errors) {
      logTest('createReservation mutation (authenticated)', false, data.errors[0].message)
    } else {
      logTest('createReservation mutation (authenticated)', true, 'Reservation created successfully')
    }
  } catch (error) {
    logTest('createReservation mutation (authenticated)', false, error.message)
  }
}

async function testAgencyPropertyManagement(authToken) {
  console.log('\n🏢 Testing Agency Property Management...')
  
  // Test getAgencyProperties query (using propertiesByAgency)
  try {
    const { data, error } = await executeGraphQLQuery(`
      query GetAgencyProperties($agency_id: ID!) {
        propertiesByAgency(agency_id: $agency_id) {
          id
          title
          description
          price
          currency
          city
          neighborhood
          property_type
          bedrooms
          bathrooms
          area_m2
          amenities
          images
          status
          agency_id
          created_at
          updated_at
        }
      }
    `, { agency_id: '1' }, { 'Authorization': `Bearer ${authToken}` })
    
    if (error) {
      logTest('getAgencyProperties query (authenticated)', false, error)
    } else if (data.errors) {
      logTest('getAgencyProperties query (authenticated)', false, data.errors[0].message)
    } else {
      logTest('getAgencyProperties query (authenticated)', true, `Retrieved ${data.data.propertiesByAgency.length} agency properties`)
    }
  } catch (error) {
    logTest('getAgencyProperties query (authenticated)', false, error.message)
  }
}

async function testTransactionTracking(authToken) {
  console.log('\n💰 Testing Transaction Tracking...')
  
  // Test getTransactions query
  try {
    const { data, error } = await executeGraphQLQuery(`
      query GetTransactions {
        transactions {
          id
          amount
          type
          status
          reservation_id
          user_id
          created_at
          updated_at
        }
      }
    `, {}, { 'Authorization': `Bearer ${authToken}` })
    
    if (error) {
      logTest('getTransactions query (authenticated)', false, error)
    } else if (data.errors) {
      logTest('getTransactions query (authenticated)', false, data.errors[0].message)
    } else {
      logTest('getTransactions query (authenticated)', true, `Retrieved ${data.data.transactions.length} transactions`)
    }
  } catch (error) {
    logTest('getTransactions query (authenticated)', false, error.message)
  }
}

async function testInputValidation(authToken) {
  console.log('\n🔍 Testing Input Validation...')
  
  // Test invalid property creation
  try {
    const { data, error } = await executeGraphQLQuery(`
      mutation CreateProperty($input: CreatePropertyInput!) {
        createProperty(input: $input) {
          id
          title
        }
      }
    `, {
      input: {
        title: '', // Invalid: empty title
        description: 'Test property',
        price: -1000, // Invalid: negative price
        currency: 'USD',
        city: 'Punta del Este',
        property_type: 'Villa',
        status: 'AVAILABLE',
        agency_id: '1'
      }
    }, { 'Authorization': `Bearer ${authToken}` })
    
    if (error) {
      logTest('input validation (invalid data)', true, 'Properly rejected invalid input')
    } else if (data.errors) {
      logTest('input validation (invalid data)', true, 'GraphQL validation caught errors')
    } else {
      logTest('input validation (invalid data)', false, 'Should have rejected invalid input')
    }
  } catch (error) {
    logTest('input validation (invalid data)', true, 'Input validation working')
  }
}

async function testErrorHandling(authToken) {
  console.log('\n⚠️ Testing Error Handling...')
  
  // Test non-existent property
  try {
    const { data, error } = await executeGraphQLQuery(`
      query GetProperty($id: ID!) {
        property(id: $id) {
          id
          title
        }
      }
    `, { id: '999999' }, { 'Authorization': `Bearer ${authToken}` })
    
    if (error) {
      logTest('error handling (non-existent resource)', true, 'Properly handled non-existent resource')
    } else if (data.errors) {
      logTest('error handling (non-existent resource)', true, 'GraphQL error handling working')
    } else {
      logTest('error handling (non-existent resource)', false, 'Should have returned error for non-existent resource')
    }
  } catch (error) {
    logTest('error handling (non-existent resource)', true, 'Error handling working')
  }
}

async function runAllTests() {
  console.log('🚀 Starting Authenticated GraphQL API Tests for Avent Properties')
  console.log('=' .repeat(60))
  
  try {
    // Get authentication token
    console.log('🔐 Getting authentication token...')
    const authToken = await getAuthToken()
    console.log('✅ Authentication successful')
    
    await testGraphQLEndpoint()
    await testPropertyQueries(authToken)
    await testUserQueries(authToken)
    await testReservationQueries(authToken)
    await testPropertyMutations(authToken)
    await testReservationMutations(authToken)
    await testAgencyPropertyManagement(authToken)
    await testTransactionTracking(authToken)
    await testInputValidation(authToken)
    await testErrorHandling(authToken)
    
  } catch (error) {
    console.error('❌ Authentication failed:', error.message)
    logTest('authentication', false, error.message)
  }
  
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
    console.log('✅ All GraphQL API tests passed! Ready for component integration.')
  } else {
    console.log('🔧 Fix failed tests before proceeding to component integration.')
  }
}

// Run tests
runAllTests().catch(console.error)






