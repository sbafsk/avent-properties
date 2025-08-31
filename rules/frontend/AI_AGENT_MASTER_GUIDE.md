# AI Agent Master Guide: Premium Frontend Development

## Avent Properties - Luxury Real Estate Platform

### 🎯 Project Overview

**Avent Properties** is a luxury real estate platform targeting HNWIs (High Net Worth Individuals) in Dubai/UAE, showcasing premium properties in Uruguay's coastal destinations (Punta del Este, José Ignacio, Piriápolis).

**Tech Stack:**

- Next.js 14+ (App Router)
- TypeScript (strict mode)
- TailwindCSS + shadcn/ui
- Supabase (GraphQL API)
- Glassmorphism design system
- Dark theme with gold accents

---

## 🏗️ Component Architecture Philosophy

### Core Principles

1. **Composition over Configuration** - Build flexible, reusable components
2. **Separation of Concerns** - Layout, styling, and logic should be distinct
3. **Design System First** - Consistent visual language across all components
4. **Performance Optimized** - Minimal re-renders, efficient bundle sizes
5. **Accessibility by Default** - WCAG 2.1 compliance built-in

### Component Hierarchy

```
App Layout
├── MainLayout (Navigation, Footer, Theme Provider)
├── Page Components (main-page.tsx, property-page.tsx)
├── Feature Components (PropertyGallery, PropertySpecs, PropertyCTA)
├── UI Components (Button, Card, Badge, Input)
└── Utility Components (GlassCard, SectionHeader)
```

---

## 📋 Component Development Standards

### 1. Component Structure Template

```tsx
// components/feature/component-name.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { ComponentProps } from "./types";

interface ComponentNameProps {
  // Required props first
  title: string;
  children: React.ReactNode;

  // Optional props with defaults
  variant?: "default" | "premium" | "luxury";
  size?: "sm" | "md" | "lg";
  className?: string;

  // Event handlers
  onClick?: () => void;
  onHover?: () => void;
}

export function ComponentName({
  title,
  children,
  variant = "default",
  size = "md",
  className,
  onClick,
  onHover,
  ...props
}: ComponentNameProps) {
  return (
    <div
      className={cn(
        // Base styles
        "base-styles-here",

        // Variant styles
        {
          "variant-default-styles": variant === "default",
          "variant-premium-styles": variant === "premium",
          "variant-luxury-styles": variant === "luxury",
        },

        // Size styles
        {
          "size-sm-styles": size === "sm",
          "size-md-styles": size === "md",
          "size-lg-styles": size === "lg",
        },

        // Custom classes
        className
      )}
      onClick={onClick}
      onMouseEnter={onHover}
      {...props}
    >
      <h2 className="component-title-styles">{title}</h2>
      <div className="component-content-styles">{children}</div>
    </div>
  );
}
```

### 2. Design System Components

#### GlassCard Component

```tsx
// components/ui/glass-card.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "premium" | "luxury";
  padding?: "sm" | "md" | "lg" | "xl";
}

export function GlassCard({
  children,
  className,
  variant = "default",
  padding = "md",
}: GlassCardProps) {
  return (
    <div
      className={cn(
        // Base glassmorphism
        "backdrop-blur-md bg-white/10 border border-white/20",
        "rounded-xl shadow-2xl",

        // Variants
        {
          "bg-white/5 border-white/10": variant === "default",
          "bg-white/15 border-white/30 shadow-gold/20": variant === "premium",
          "bg-gradient-to-br from-white/20 to-white/5 border-gold/30":
            variant === "luxury",
        },

        // Padding variants
        {
          "p-4": padding === "sm",
          "p-6": padding === "md",
          "p-8": padding === "lg",
          "p-12": padding === "xl",
        },

        className
      )}
    >
      {children}
    </div>
  );
}
```

#### Premium Button Component

```tsx
// components/ui/button.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  "disabled:pointer-events-none disabled:opacity-50",

  // Variants
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        premium: "bg-gold text-gold-foreground hover:bg-gold/90 shadow-lg",
        luxury:
          "bg-gradient-to-r from-gold to-gold/80 text-gold-foreground hover:from-gold/90 hover:to-gold/70 shadow-xl",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        glass:
          "backdrop-blur-md bg-white/10 border border-white/20 text-foreground hover:bg-white/20",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8 text-lg",
        xl: "h-12 px-10 text-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

### 3. Page Component Structure

#### Main Page Template

```tsx
// app/page.tsx
import { MainLayout } from "@/components/layout/main-layout";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { CTASection } from "@/components/sections/cta-section";

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </MainLayout>
  );
}
```

#### Section Components

```tsx
// components/sections/hero-section.tsx
import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="hero-background-styles" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <GlassCard variant="luxury" padding="xl">
          <SectionHeader
            title="Discover Luxury Coastal Living"
            subtitle="Premium properties in Uruguay's most exclusive coastal destinations"
            centered
            className="mb-8"
          />

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="premium" size="lg">
              Browse Properties
            </Button>
            <Button variant="glass" size="lg">
              Schedule Tour
            </Button>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
```

---

## 🎨 Styling Guidelines

### 1. TailwindCSS Best Practices

#### Custom Design Tokens

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Brand colors
        gold: {
          50: "#fefce8",
          100: "#fef9c3",
          500: "#eab308",
          600: "#ca8a04",
          900: "#713f12",
          DEFAULT: "#eab308",
          foreground: "#0f172a",
        },

        // Semantic colors
        luxury: {
          background: "oklch(0.145 0 0)",
          foreground: "oklch(0.985 0 0)",
          accent: "oklch(0.269 0 0)",
        },
      },

      fontFamily: {
        luxury: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },

      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
      },
    },
  },
};
```

#### Utility Classes Organization

```tsx
// Good: Organized, readable class order
<div className={cn(
  // Layout
  'flex items-center justify-between',

  // Spacing
  'p-6 mb-8',

  // Sizing
  'w-full max-w-4xl',

  // Colors & Background
  'bg-background text-foreground',

  // Borders & Effects
  'rounded-xl border border-border',

  // Transitions
  'transition-all duration-200',

  // States
  'hover:shadow-lg focus:ring-2 focus:ring-ring',

  // Custom classes
  className
)} />

// Bad: Random, hard-to-read class order
<div className="bg-background p-6 flex items-center rounded-xl border border-border hover:shadow-lg transition-all duration-200 justify-between mb-8 w-full max-w-4xl text-foreground focus:ring-2 focus:ring-ring" />
```

### 2. Component Styling Patterns

#### Variant-Based Styling

```tsx
// Use CVA (Class Variance Authority) for complex variants
const cardVariants = cva("rounded-lg border transition-all", {
  variants: {
    variant: {
      default: "bg-card text-card-foreground border-border",
      premium: "bg-gradient-to-br from-gold/10 to-gold/5 border-gold/20",
      luxury:
        "bg-gradient-to-br from-white/20 to-white/5 border-gold/30 backdrop-blur-md",
    },
    size: {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});
```

#### Responsive Design Patterns

```tsx
// Mobile-first responsive design
<div
  className={cn(
    // Mobile (default)
    "flex flex-col gap-4 p-4",

    // Tablet
    "md:flex-row md:gap-6 md:p-6",

    // Desktop
    "lg:gap-8 lg:p-8",

    // Large screens
    "xl:max-w-6xl xl:mx-auto"
  )}
/>
```

---

## 🔧 Development Tools & Utilities

### 1. Utility Functions

```tsx
// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Type-safe variant helpers
export function createVariants<T extends Record<string, any>>(variants: T) {
  return variants;
}

// Responsive breakpoint helpers
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;
```

### 2. Type Definitions

```tsx
// types/component-props.ts
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface VariantProps {
  variant?: "default" | "premium" | "luxury";
  size?: "sm" | "md" | "lg" | "xl";
}

export interface InteractiveProps {
  onClick?: () => void;
  onHover?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

// Property-specific types
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  city: string;
  neighborhood?: string;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area_m2?: number;
  amenities?: string[];
  images?: string[];
  status: "available" | "reserved" | "sold";
}
```

---

## 📱 Component Examples

### 1. Property Card Component

```tsx
// components/property/property-card.tsx
import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { MapPin, Bed, Bath, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
  className?: string;
  onViewDetails?: (id: string) => void;
  onScheduleTour?: (id: string) => void;
}

export function PropertyCard({
  property,
  className,
  onViewDetails,
  onScheduleTour,
}: PropertyCardProps) {
  return (
    <GlassCard
      variant="premium"
      className={cn(
        "group hover:scale-105 transition-transform duration-300",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
        <Image
          src={property.images?.[0] || "/placeholder-property.jpg"}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <Badge
          variant="outline"
          className="absolute top-3 left-3 glass border-gold text-gold"
        >
          {property.property_type}
        </Badge>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div>
          <h3 className="heading-luxury text-xl text-foreground mb-2">
            {property.title}
          </h3>
          <div className="flex items-center text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {property.city}
              {property.neighborhood && `, ${property.neighborhood}`}
            </span>
          </div>
        </div>

        {/* Specs */}
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
              ${property.price.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground ml-1">
              {property.currency}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails?.(property.id)}
          >
            View Details
          </Button>
          <Button
            variant="premium"
            size="sm"
            className="flex-1"
            onClick={() => onScheduleTour?.(property.id)}
          >
            Schedule Tour
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
```

### 2. Section Header Component

```tsx
// components/ui/section-header.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function SectionHeader({
  title,
  subtitle,
  centered = false,
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn("space-y-4", centered && "text-center", className)}>
      <h2
        className={cn(
          "heading-luxury text-3xl md:text-4xl lg:text-5xl text-foreground",
          titleClassName
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "text-luxury text-lg md:text-xl text-muted-foreground max-w-3xl",
            centered && "mx-auto",
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
```

---

## 🚀 Performance Optimization

### 1. Component Optimization

```tsx
// Use React.memo for expensive components
export const PropertyCard = React.memo(function PropertyCard({
  property,
  className,
  onViewDetails,
  onScheduleTour,
}: PropertyCardProps) {
  // Component implementation
});

// Use useCallback for event handlers
export function PropertyList({ properties }: PropertyListProps) {
  const handleViewDetails = useCallback(
    (id: string) => {
      router.push(`/properties/${id}`);
    },
    [router]
  );

  const handleScheduleTour = useCallback(
    (id: string) => {
      router.push(`/tour-wizard?property=${id}`);
    },
    [router]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onViewDetails={handleViewDetails}
          onScheduleTour={handleScheduleTour}
        />
      ))}
    </div>
  );
}
```

### 2. Image Optimization

```tsx
// components/ui/optimized-image.tsx
import Image from "next/image";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = "100vw",
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn("object-cover", className)}
      priority={priority}
      sizes={sizes}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    />
  );
}
```

---

## 🧪 Testing Guidelines

### 1. Component Testing

```tsx
// __tests__/components/property-card.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { PropertyCard } from "@/components/property/property-card";
import { mockProperty } from "@/lib/test-utils";

describe("PropertyCard", () => {
  const mockOnViewDetails = jest.fn();
  const mockOnScheduleTour = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders property information correctly", () => {
    render(
      <PropertyCard
        property={mockProperty}
        onViewDetails={mockOnViewDetails}
        onScheduleTour={mockOnScheduleTour}
      />
    );

    expect(screen.getByText(mockProperty.title)).toBeInTheDocument();
    expect(screen.getByText(mockProperty.city)).toBeInTheDocument();
    expect(
      screen.getByText(`$${mockProperty.price.toLocaleString()}`)
    ).toBeInTheDocument();
  });

  it("calls onViewDetails when view details button is clicked", () => {
    render(
      <PropertyCard
        property={mockProperty}
        onViewDetails={mockOnViewDetails}
        onScheduleTour={mockOnScheduleTour}
      />
    );

    fireEvent.click(screen.getByText("View Details"));
    expect(mockOnViewDetails).toHaveBeenCalledWith(mockProperty.id);
  });

  it("calls onScheduleTour when schedule tour button is clicked", () => {
    render(
      <PropertyCard
        property={mockProperty}
        onViewDetails={mockOnViewDetails}
        onScheduleTour={mockOnScheduleTour}
      />
    );

    fireEvent.click(screen.getByText("Schedule Tour"));
    expect(mockOnScheduleTour).toHaveBeenCalledWith(mockProperty.id);
  });
});
```

---

## 📚 AI Agent Training Checklist

### ✅ Component Creation Checklist

- [ ] Component follows the established structure template
- [ ] All props are properly typed with TypeScript interfaces
- [ ] Component uses design system tokens (colors, spacing, typography)
- [ ] Responsive design implemented (mobile-first)
- [ ] Accessibility attributes included (ARIA labels, semantic HTML)
- [ ] Performance optimizations applied (React.memo, useCallback where needed)
- [ ] Component is fully testable with clear prop interfaces
- [ ] Styling uses utility classes in logical order
- [ ] Component is reusable and composable
- [ ] Error boundaries and loading states handled

### ✅ Page Component Checklist

- [ ] Page uses MainLayout wrapper
- [ ] Page is broken into logical sections
- [ ] Each section is a separate component
- [ ] No inline styles or complex class strings
- [ ] Proper SEO metadata included
- [ ] Loading and error states implemented
- [ ] Page is server-side rendered where possible
- [ ] Dynamic imports used for heavy components

### ✅ Styling Checklist

- [ ] Uses design system tokens (no hardcoded colors/spacing)
- [ ] Tailwind classes organized logically
- [ ] Responsive breakpoints properly implemented
- [ ] Dark theme support included
- [ ] Glassmorphism effects applied consistently
- [ ] Animations and transitions are smooth
- [ ] Focus states are clearly visible
- [ ] Print styles considered

### ✅ Code Quality Checklist

- [ ] TypeScript strict mode compliance
- [ ] ESLint rules followed
- [ ] Prettier formatting applied
- [ ] JSDoc comments for complex functions
- [ ] No console.log statements in production code
- [ ] Proper error handling implemented
- [ ] Performance monitoring hooks included
- [ ] Security best practices followed

---

## 🎯 Key Takeaways for AI Agents

1. **Always use the design system** - Don't create new styles, use existing tokens
2. **Break down complex pages** - Split into logical, reusable components
3. **Prioritize readability** - Clean, organized code is more maintainable
4. **Think mobile-first** - Responsive design is non-negotiable
5. **Performance matters** - Optimize images, use proper React patterns
6. **Accessibility is essential** - Build inclusive experiences
7. **Test everything** - Write tests for all components and interactions
8. **Follow the patterns** - Consistency across the codebase is crucial

This guide ensures that AI agents can build premium, maintainable, and scalable frontend code that aligns with Avent Properties' luxury brand and technical requirements.
