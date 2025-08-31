import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PropertyCard } from "@/components/property-card";
import { PropertyGridSkeleton } from "@/components/ui/property-grid-skeleton";
import { ErrorBoundary } from "@/components/error-boundary";
import { MapPin } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import type { Property } from "@/hooks/use-properties";

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
  error?: string | null;
  onViewDetails?: (id: string) => void;
  onScheduleTour?: (id: string) => void;
  className?: string;
}

export function PropertyGrid({
  properties,
  loading = false,
  error = null,
  onViewDetails,
  onScheduleTour,
  className,
}: PropertyGridProps) {
  // Loading state
  if (loading) {
    return (
      <div className={className}>
        <PropertyGridSkeleton count={6} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <GlassCard variant="premium" className="max-w-md mx-auto">
          <div className="p-8">
            <h3 className="heading-luxury text-xl text-foreground mb-2">
              Error Loading Properties
            </h3>
            <p className="text-luxury text-muted-foreground mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gold text-gold-foreground px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // Empty state
  if (properties.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`text-center py-16 ${className}`}
      >
        <GlassCard variant="premium" className="max-w-md mx-auto">
          <div className="p-8">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="heading-luxury text-xl text-foreground mb-2">
              No Properties Found
            </h3>
            <p className="text-luxury text-muted-foreground">
              Try adjusting your filters to see more properties.
            </p>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  // Properties grid
  return (
    <ErrorBoundary>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
        <AnimatePresence mode="wait">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
              }}
            >
              <PropertyCard
                id={property.id}
                title={property.title}
                city={property.city}
                neighborhood={property.neighborhood}
                price={property.price}
                currency={property.currency}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area_m2={property.area_m2}
                imageUrl={property.images?.[0] || "/placeholder-property.jpg"}
                property_type={property.property_type}
                featured={index < 2} // First 2 properties are featured
                onViewDetails={onViewDetails}
                onScheduleTour={onScheduleTour}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
