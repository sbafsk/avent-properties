import { MainLayout } from "@/components/main-layout";
import { PropertyGallery } from "@/components/property-gallery";
import { PropertySpecs } from "@/components/property-specs";
import { PropertyCTA } from "@/components/property-cta";
import { PropertyNavigation } from "@/components/sections/property-navigation";
import { PropertyHeader } from "@/components/sections/property-header";
import { PropertyDescription } from "@/components/sections/property-description";
import { PropertyLocation } from "@/components/sections/property-location";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

// Fetch property from Supabase
async function getProperty(id: string) {
  const supabase = await createClient()
  
  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error || !property) {
    return null
  }
  
  return property
}

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = await getProperty(id)
  
  if (!property) {
    notFound()
  }
  return (
    <MainLayout>
      <div className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <PropertyNavigation />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <PropertyHeader property={property} />
              <PropertyGallery images={property.images || []} title={property.title} />
              <PropertyDescription description={property.description} />
              <PropertySpecs
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area_m2}
                parking={3}
                yearBuilt={2021}
                lotSize={800}
                amenities={property.amenities || []}
                features={property.amenities || []}
              />
              <PropertyLocation city={property.city} neighborhood={property.neighborhood} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <PropertyCTA price={property.price} currency={property.currency} propertyId={property.id} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
