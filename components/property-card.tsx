import React from "react";
import { PropertyCard as PropertyCardCompound, type PropertyData } from "./property-card-compound";

interface PropertyCardProps {
  id: string;
  title: string;
  city: string;
  neighborhood?: string;
  price: number;
  currency: string;
  bedrooms?: number;
  bathrooms?: number;
  area_m2?: number;
  imageUrl: string;
  featured?: boolean;
  property_type: string;
  className?: string;
  onViewDetails?: (id: string) => void;
  onScheduleTour?: (id: string) => void;
}

/**
 * PropertyCard Component - Now using Compound Components Pattern
 * 
 * This component maintains backward compatibility while internally using
 * the new compound components pattern for better flexibility and maintainability.
 * 
 * @deprecated Consider using PropertyCard compound components directly for more flexibility
 */
export function PropertyCard({
  id,
  title,
  city,
  neighborhood,
  price,
  currency,
  bedrooms,
  bathrooms,
  area_m2,
  imageUrl,
  featured = false,
  property_type,
  className,
  onViewDetails,
  onScheduleTour,
}: PropertyCardProps) {
  // Convert props to PropertyData format
  const property: PropertyData = {
    id,
    title,
    city,
    neighborhood,
    price,
    currency,
    bedrooms,
    bathrooms,
    area_m2,
    imageUrl,
    featured,
    property_type,
  };

  return (
    <PropertyCardCompound
      property={property}
      className={className}
      onViewDetails={onViewDetails}
      onScheduleTour={onScheduleTour}
    >
      <PropertyCardCompound.ImageContainer>
        <PropertyCardCompound.Image />
        <PropertyCardCompound.Badges />
        <PropertyCardCompound.Favorite />
      </PropertyCardCompound.ImageContainer>

      <PropertyCardCompound.Content>
        <PropertyCardCompound.Header />
        <PropertyCardCompound.Specs />
        <PropertyCardCompound.Price />
        <PropertyCardCompound.Actions />
      </PropertyCardCompound.Content>
    </PropertyCardCompound>
  );
}
