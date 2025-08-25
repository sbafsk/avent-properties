import { DashboardClient } from "@/components/dashboard-client"
import { createClient } from '@/lib/supabase/server'

// Fetch data from Supabase
async function getDashboardData() {
  const supabase = await createClient()
  
  // Fetch user profile (for now, return a placeholder until auth is implemented)
  const userProfile = {
    id: "1",
    firstName: "Ahmed",
    lastName: "Al-Rashid",
    email: "ahmed.alrashid@example.com",
    phone: "+971 50 123 4567",
    location: "Dubai, UAE",
    preferredLanguage: "en" as const,
    investmentBudget: "$2.5M - $5M",
    propertyTypes: ["Villa", "Penthouse", "Estate"],
    locations: ["Punta del Este", "José Ignacio"],
    membershipTier: "platinum" as const,
    joinDate: "2023-01-15",
    totalInvestment: 3200000,
  }
  
  // Fetch reservations
  const { data: reservations, error: reservationsError } = await supabase
    .from('tour_reservations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)
  
  // Fetch properties
  const { data: properties, error: propertiesError } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)
  
  // Fetch transactions
  const { data: transactions, error: transactionsError } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)
  
  return {
    userProfile,
    reservations: reservations || [],
    properties: properties || [],
    transactions: transactions || [],
    errors: {
      reservations: reservationsError,
      properties: propertiesError,
      transactions: transactionsError,
    }
  }
}

export default async function DashboardPage() {
  const dashboardData = await getDashboardData()
  
  return <DashboardClient {...dashboardData} />
}
