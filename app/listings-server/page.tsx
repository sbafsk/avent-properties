import { createClient } from '@/lib/supabase/server'
import { MainLayout } from '@/components/main-layout'
import { ListingsWithFilters } from '@/components/listings-with-filters'

// Server-side data fetching for SEO
async function getProperties() {
  const supabase = await createClient()
  
  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'AVAILABLE')
    .order('created_at', { ascending: false })
    .limit(20) // Limit for initial load
  
  if (error) {
    console.error('Error fetching properties:', error)
    return []
  }
  
  return properties || []
}

export default async function ListingsServerPage() {
  const initialProperties = await getProperties()
  
  return (
    <MainLayout>
      <div className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="heading-luxury text-4xl md:text-5xl text-foreground mb-4">
              Luxury Properties
            </h1>
            <p className="text-luxury text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover exceptional coastal properties in Uruguay&apos;s most prestigious locations
            </p>
          </div>
          
          {/* Listings with Filters - Server-side initial data, client-side updates */}
          <ListingsWithFilters initialProperties={initialProperties} />
        </div>
      </div>
    </MainLayout>
  )
}
