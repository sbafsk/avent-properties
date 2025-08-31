# Implementation Master Guide: Avent Properties Frontend

## Complete Implementation Examples & Project Blueprint

---

## 🚀 Before vs After: Component Refactoring

### Before: Monolithic Main Page

```tsx
// main-page.tsx (BEFORE - 120+ lines)
export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section - 50+ lines of inline JSX */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 z-0">
          <Image
            src="..."
            alt="..."
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <GlassCard className="p-8 md:p-12">
            <h1 className="heading-luxury text-4xl md:text-6xl lg:text-7xl text-foreground mb-6">
              Discover Luxury
              <span className="text-gold block">Coastal Living</span>
            </h1>
            <p className="text-luxury text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Premium properties in Uruguay's most exclusive coastal
              destinations...
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/listings">
                <Button
                  size="lg"
                  className="bg-gold text-gold-foreground hover:bg-gold/90 text-lg px-8 py-4"
                >
                  Browse Properties
                </Button>
              </Link>
              <Link href="/tour-wizard">
                <Button
                  size="lg"
                  variant="outline"
                  className="glass border-gold text-gold hover:bg-gold hover:text-gold-foreground text-lg px-8 py-4 bg-transparent"
                >
                  Schedule Tour
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Features Section - 70+ lines of inline JSX */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Why Uruguay?"
            subtitle="..."
            centered
            className="mb-16"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 3 feature cards with repetitive code */}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
```

### After: Modular Component Structure

```tsx
// app/page.tsx (AFTER - 8 lines)
import { MainLayout } from "@/components/layout/main-layout";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
    </MainLayout>
  );
}
```

---

## 🎨 Complete Component Implementation Examples

### 1. Reusable Button Component

```tsx
// components/ui/button.tsx
import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  'disabled:pointer-events-none disabled:opacity-50',

  // Variants
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        premium: 'bg-gold text-gold-foreground hover:bg-gold/90 shadow-lg',
        luxury: 'bg-gradient-to-r from-gold to-gold/80 text-gold-foreground hover:from-gold/90 hover:to-gold/70 shadow-xl',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        glass: 'backdrop-blur-md bg-white/10 border border-white/20 text-foreground hover:bg-white/20',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8 text-lg',
        xl: 'h-12 px-10 text-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

// Usage examples:
<Button variant="premium" size="lg">Browse Properties</Button>
<Button variant="glass" size="md">Learn More</Button>
<Button variant="outline" size="sm">Cancel</Button>
```

### 2. Property Card Component

```tsx
// components/property/property-card.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { MapPin, Bed, Bath, Square, Heart } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import type { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
  variant?: "default" | "premium" | "featured";
  className?: string;
  onViewDetails?: (id: string) => void;
  onScheduleTour?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

export function PropertyCard({
  property,
  variant = "default",
  className,
  onViewDetails,
  onScheduleTour,
  onToggleFavorite,
  isFavorite = false,
}: PropertyCardProps) {
  const handleViewDetails = () => onViewDetails?.(property.id);
  const handleScheduleTour = () => onScheduleTour?.(property.id);
  const handleToggleFavorite = () => onToggleFavorite?.(property.id);

  return (
    <GlassCard
      variant={variant === "featured" ? "luxury" : "premium"}
      className={cn(
        "group hover:scale-105 transition-all duration-300",
        variant === "featured" && "ring-2 ring-gold/50",
        className
      )}
    >
      {/* Image with overlay */}
      <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
        <Image
          src={property.images?.[0] || "/placeholder-property.jpg"}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Status badge */}
        <Badge
          variant="outline"
          className="absolute top-3 left-3 glass border-gold text-gold"
        >
          {property.property_type}
        </Badge>

        {/* Favorite button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors"
        >
          <Heart
            className={cn(
              "h-5 w-5",
              isFavorite ? "fill-red-500 text-red-500" : "text-white"
            )}
          />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Title and location */}
        <div>
          <h3 className="heading-luxury text-xl text-foreground mb-2 line-clamp-2">
            {property.title}
          </h3>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {property.city}
              {property.neighborhood && `, ${property.neighborhood}`}
            </span>
          </div>
        </div>

        {/* Specifications */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.area_m2 && (
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{property.area_m2}m²</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gold">
              {formatPrice(property.price, property.currency)}
            </span>
          </div>
          {variant === "featured" && (
            <Badge
              variant="premium"
              className="bg-gold/20 text-gold border-gold/30"
            >
              Featured
            </Badge>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
          <Button
            variant="premium"
            size="sm"
            className="flex-1"
            onClick={handleScheduleTour}
          >
            Schedule Tour
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}

// Usage examples:
<PropertyCard
  property={property}
  variant="featured"
  onViewDetails={(id) => router.push(`/properties/${id}`)}
  onScheduleTour={(id) => router.push(`/tour-wizard?property=${id}`)}
  onToggleFavorite={(id) => toggleFavorite(id)}
  isFavorite={favorites.includes(property.id)}
/>;
```

### 3. Property Gallery Component

```tsx
// components/property/property-gallery.tsx
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  images: string[];
  title: string;
  variant?: "grid" | "carousel" | "masonry";
  showThumbnails?: boolean;
  className?: string;
}

export function PropertyGallery({
  images,
  title,
  variant = "carousel",
  showThumbnails = true,
  className,
}: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images.length) {
    return (
      <GlassCard
        className={cn(
          "aspect-video flex items-center justify-center",
          className
        )}
      >
        <p className="text-muted-foreground">No images available</p>
      </GlassCard>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main image display */}
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <Image
          src={images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority={currentIndex === 0}
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="glass"
              size="sm"
              className="absolute left-4 top-1/2 -translate-y-1/2"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="glass"
              size="sm"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Fullscreen button */}
        <Button
          variant="glass"
          size="sm"
          className="absolute top-4 right-4"
          onClick={() => setIsFullscreen(true)}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>

        {/* Image counter */}
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-white text-sm">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Thumbnail navigation */}
      {showThumbnails && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={cn(
                "relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all",
                index === currentIndex
                  ? "border-gold ring-2 ring-gold/20"
                  : "border-transparent hover:border-white/30"
              )}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <Button
            variant="glass"
            size="sm"
            className="absolute top-4 right-4 z-10"
            onClick={() => setIsFullscreen(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="relative w-full h-full flex items-center justify-center p-8">
            <Image
              src={images[currentIndex]}
              alt={`${title} - Fullscreen`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
            />

            {images.length > 1 && (
              <>
                <Button
                  variant="glass"
                  size="lg"
                  className="absolute left-8 top-1/2 -translate-y-1/2"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="glass"
                  size="lg"
                  className="absolute right-8 top-1/2 -translate-y-1/2"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

### 4. Property Specifications Component

```tsx
// components/property/property-specs.tsx
import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  Bed,
  Bath,
  Square,
  Car,
  Calendar,
  MapPin,
  Wifi,
  Waves,
  Mountain,
  TreePine,
} from "lucide-react";
import { cn, formatArea } from "@/lib/utils";

interface PropertySpecsProps {
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  parking?: number;
  yearBuilt?: number;
  lotSize?: number;
  amenities?: string[];
  features?: string[];
  className?: string;
}

const amenityIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  wifi: Wifi,
  "ocean-view": Waves,
  "mountain-view": Mountain,
  garden: TreePine,
};

export function PropertySpecs({
  bedrooms,
  bathrooms,
  area,
  parking,
  yearBuilt,
  lotSize,
  amenities = [],
  features = [],
  className,
}: PropertySpecsProps) {
  const specs = [
    { icon: Bed, label: "Bedrooms", value: bedrooms },
    { icon: Bath, label: "Bathrooms", value: bathrooms },
    { icon: Square, label: "Area", value: area ? formatArea(area) : undefined },
    { icon: Car, label: "Parking", value: parking },
    { icon: Calendar, label: "Year Built", value: yearBuilt },
    {
      icon: MapPin,
      label: "Lot Size",
      value: lotSize ? `${lotSize}m²` : undefined,
    },
  ].filter((spec) => spec.value !== undefined);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Basic Specifications */}
      <GlassCard className="p-6">
        <h3 className="heading-luxury text-xl text-foreground mb-4">
          Property Details
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {specs.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                <Icon className="h-5 w-5 text-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-semibold text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Amenities */}
      {amenities.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="heading-luxury text-xl text-foreground mb-4">
            Amenities
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {amenities.map((amenity) => {
              const IconComponent =
                amenityIcons[amenity.toLowerCase()] || Square;
              return (
                <div key={amenity} className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-gold" />
                  <span className="text-sm text-foreground capitalize">
                    {amenity.replace("-", " ")}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* Features */}
      {features.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="heading-luxury text-xl text-foreground mb-4">
            Features
          </h3>
          <div className="flex flex-wrap gap-2">
            {features.map((feature) => (
              <Badge
                key={feature}
                variant="outline"
                className="glass border-gold/30 text-gold"
              >
                {feature}
              </Badge>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
```

---

## 🔧 Custom Hooks Examples

### 1. Property Data Hook

```tsx
// hooks/use-properties.ts
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Property } from "@/types/property";

interface UsePropertiesOptions {
  filters?: {
    city?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
  };
  limit?: number;
}

export function useProperties(options: UsePropertiesOptions = {}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      let query = supabase
        .from("properties")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });

      // Apply filters
      if (options.filters?.city) {
        query = query.eq("city", options.filters.city);
      }
      if (options.filters?.propertyType) {
        query = query.eq("property_type", options.filters.propertyType);
      }
      if (options.filters?.minPrice) {
        query = query.gte("price", options.filters.minPrice);
      }
      if (options.filters?.maxPrice) {
        query = query.lte("price", options.filters.maxPrice);
      }
      if (options.filters?.bedrooms) {
        query = query.gte("bedrooms", options.filters.bedrooms);
      }

      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      setProperties(data || []);
      setHasMore((data?.length || 0) === (options.limit || 20));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch properties"
      );
    } finally {
      setLoading(false);
    }
  }, [options.filters, options.limit]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const refresh = useCallback(() => {
    fetchProperties();
  }, [fetchProperties]);

  return {
    properties,
    loading,
    error,
    hasMore,
    refresh,
  };
}
```

### 2. Favorites Management Hook

```tsx
// hooks/use-favorites.ts
import { useState, useEffect, useCallback } from "react";

const FAVORITES_KEY = "avent-properties-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((propertyId: string) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  }, []);

  const isFavorite = useCallback(
    (propertyId: string) => {
      return favorites.includes(propertyId);
    },
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
}
```

---

## 📱 Page Implementation Examples

### 1. Properties Listing Page

```tsx
// app/properties/page.tsx
import { Suspense } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { PropertyGrid } from "@/components/property/property-grid";
import { PropertyFilters } from "@/components/property/property-filters";
import { SectionHeader } from "@/components/ui/section-header";
import { PropertyGridSkeleton } from "@/components/ui/skeletons";

export default function PropertiesPage() {
  return (
    <MainLayout>
      <div className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Luxury Properties"
            subtitle="Discover exclusive real estate opportunities in Uruguay's most prestigious coastal destinations"
            centered
            className="mb-12"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <PropertyFilters />
            </div>

            {/* Properties Grid */}
            <div className="lg:col-span-3">
              <Suspense fallback={<PropertyGridSkeleton />}>
                <PropertyGrid />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
```

### 2. Property Details Page (Refactored)

```tsx
// app/properties/[id]/page.tsx
import { notFound } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { PropertyHeader } from "@/components/property/property-header";
import { PropertyGallery } from "@/components/property/property-gallery";
import { PropertySpecs } from "@/components/property/property-specs";
import { PropertyCTA } from "@/components/property/property-cta";
import { PropertyLocation } from "@/components/property/property-location";
import { BackButton } from "@/components/ui/back-button";
import { getProperty } from "@/lib/supabase/properties";

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <BackButton href="/properties" className="mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <PropertyHeader property={property} />
              <PropertyGallery
                images={property.images || []}
                title={property.title}
              />
              <PropertySpecs
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area_m2}
                amenities={property.amenities}
              />
              <PropertyLocation property={property} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <PropertyCTA property={property} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
```

---

## 🏗️ Project Architecture & Development Workflow

### Technical Foundation

- **Framework:** Next.js (latest App Router) + TypeScript
- **Package Manager:** Yarn
- **Database:** Supabase (Postgres + Auth + Storage) → migrate to AWS RDS + S3 later
- **API Layer:** GraphQL (Apollo Server or Yoga) hosted via Supabase Functions (MVP) → move to AWS Lambda/AppSync later
- **Auth:** Supabase Auth (JWT + RLS policies)
- **Payments:** Stripe (deposits, commissions)
- **Storage:** Supabase Storage (property images, docs)
- **Hosting:** Vercel (MVP) → AWS (future)
- **CI/CD:** GitHub Actions → Vercel (MVP) → AWS CodePipeline (future)

### Domain Model

#### Core Entities

- **User** (client, agency, admin)
- **Agency** (local partner, owns properties)
- **Property** (luxury unit details, media, status)
- **TourReservation** (10% deposit, travel package)
- **Transaction** (deposits, commissions, VAT)
- **ContactRequest** (inquiries from clients)
- **AuditLog** (actions, compliance trail)

### GraphQL API Schema (Excerpt)

```graphql
type User {
  id: ID!
  role: UserRole!
  name: String!
  email: String!
  preferences: JSON
  reservations: [TourReservation!]
}

enum UserRole {
  ADMIN
  CLIENT
  AGENCY
}

type Property {
  id: ID!
  title: String!
  description: String!
  price: Float!
  currency: String!
  city: String!
  neighborhood: String
  propertyType: String!
  bedrooms: Int
  bathrooms: Int
  areaM2: Int
  amenities: [String!]
  images: [String!]
  status: PropertyStatus!
}

enum PropertyStatus {
  AVAILABLE
  RESERVED
  SOLD
}

type TourReservation {
  id: ID!
  user: User!
  property: Property!
  scheduledDate: String!
  depositAmount: Float!
  status: ReservationStatus!
}

enum ReservationStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

type Transaction {
  id: ID!
  amount: Float!
  type: TransactionType!
  status: TxStatus!
  createdAt: String!
}

enum TransactionType {
  DEPOSIT
  COMMISSION
  REFUND
}
enum TxStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}
```

### Development Workflow Stages

#### Stage 1 – Foundation Setup

- Use **Yarn** for all dependencies
- Initialize Next.js + TS + App Router
- Add ESLint + Prettier + Husky (pre-commit)
- Configure TailwindCSS + shadcn/ui
- Connect Supabase project (`supabase init`)
- Setup GraphQL server (Apollo/GraphQL Yoga)

#### Stage 2 – Authentication & Access

- Supabase Auth (email/pass, JWT)
- Role-based access (RLS policies):
  - **admin**
  - **client**
  - **agency**
- Next.js middleware → protect routes

#### Stage 3 – Database & API

- Define schema in Supabase (mirror GraphQL types)
- Implement resolvers (CRUD for Properties, Reservations)
- Stripe integration via Supabase Edge Functions
- Setup caching (Apollo Client + React Query hybrid)

#### Stage 4 – Core Features (MVP)

- Property listing & detail pages
- Reservation flow (tour scheduling + deposit payment)
- Client dashboard (reservations + receipts)
- Agency dashboard (property CRUD, reservation list)
- Admin console (transactions view, audit logs)

#### Stage 5 – Testing & QA

- **Unit Tests**: Jest + ts-jest for utils/resolvers
- **Component Tests**: React Testing Library
- **Integration Tests**: GraphQL API resolvers
- **E2E**: Playwright (sign up → browse → reserve → pay)
- **CI/CD**: GitHub Actions run tests on PRs

#### Stage 6 – Deployment

- MVP: Vercel (frontend) + Supabase (backend)
- Future: AWS (RDS, S3, AppSync, ECS)
- Secrets via Vercel & Supabase vaults
- Monitoring: Sentry + Supabase logs
- Alerts: GitHub Actions CI/CD notifications

### Development Guidelines

- Always use **Yarn** (no npm)
- API must be **GraphQL** only (no REST)
- Supabase RLS for multi-tenant safety
- Prefer Apollo Client hooks in frontend
- Use TypeScript strict mode
- Maintain >80% coverage on domain logic
- Accessibility (ARIA, WCAG 2.1) enforced

---

## 🎯 Key Benefits of This Approach

### 1. **Maintainability**

- Each component has a single responsibility
- Easy to locate and modify specific functionality
- Clear separation between UI and business logic

### 2. **Reusability**

- Components can be used across different pages
- Consistent design system implementation
- Easy to create variations and themes

### 3. **Testability**

- Each component can be tested in isolation
- Clear prop interfaces make testing straightforward
- Mock data can be easily provided for testing

### 4. **Performance**

- Components can be optimized individually
- Lazy loading and code splitting are easier to implement
- React.memo and other optimizations can be applied selectively

### 5. **Developer Experience**

- Clear component structure and naming conventions
- TypeScript provides excellent IntelliSense
- Easy to onboard new developers

### 6. **Scalability**

- New features can be added without affecting existing code
- Component library can grow organically
- Design system ensures consistency across the application

This modular approach transforms complex, monolithic components into clean, maintainable, and reusable pieces that follow React and Next.js best practices while maintaining the luxury aesthetic of Avent Properties.
