import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PropertyGrid } from "./property-grid";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { Property } from "@/hooks/use-properties";

interface ListingsResultsProps {
  properties: Property[];
  allPropertiesCount: number;
  loading?: boolean;
  filtering?: boolean;
  error?: string | null;
  onViewDetails?: (id: string) => void;
  onScheduleTour?: (id: string) => void;
  className?: string;
}

export function ListingsResults({
  properties,
  allPropertiesCount,
  loading = false,
  filtering = false,
  error = null,
  onViewDetails,
  onScheduleTour,
  className,
}: ListingsResultsProps) {
  return (
    <div className={`flex-1 ${className}`}>
      {/* Results Count */}
      <div className="mb-6">
        <p className="text-luxury text-muted-foreground">
          Showing {properties.length} of {allPropertiesCount} properties
        </p>
      </div>

      {/* Loading State for Filtering */}
      <AnimatePresence mode="wait">
        {filtering ? (
          <motion.div
            key="filtering"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="py-16"
          >
            <LoadingSpinner size="lg" text="Applying filters..." />
          </motion.div>
        ) : (
          <motion.div
            key="properties"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PropertyGrid
              properties={properties}
              loading={loading}
              error={error}
              onViewDetails={onViewDetails}
              onScheduleTour={onScheduleTour}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


