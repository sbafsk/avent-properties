import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GlassCard } from "./glass-card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, Heart } from "lucide-react";
import { cn, formatPrice, formatLocation } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";

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
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(id);

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(id);
    }
  };

  const handleScheduleTour = () => {
    if (onScheduleTour) {
      onScheduleTour(id);
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite(id);
  };

  return (
    <GlassCard
      variant={featured ? "luxury" : "premium"}
      className={cn(
        "group hover:scale-105 transition-all duration-300",
        featured && "ring-2 ring-gold/50",
        className
      )}
    >
      {/* Image with overlay */}
      <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
        <Image
          src={imageUrl || "/placeholder-property.jpg"}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Status badges */}
        {featured && (
          <Badge
            variant="default"
            className="absolute top-3 left-3 bg-gold text-gold-foreground"
          >
            Featured
          </Badge>
        )}
        <Badge
          variant="outline"
          className="absolute top-3 right-12 glass border-gold text-gold"
        >
          {property_type}
        </Badge>

        {/* Favorite button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors"
        >
          <Heart
            className={cn(
              "h-5 w-5",
              isFav ? "fill-red-500 text-red-500" : "text-white"
            )}
          />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Title and location */}
        <div>
          <h3 className="heading-luxury text-xl text-foreground mb-2 line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {formatLocation(city, neighborhood)}
            </span>
          </div>
        </div>

        {/* Specifications */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{bedrooms}</span>
            </div>
          )}
          {bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{bathrooms}</span>
            </div>
          )}
          {area_m2 && (
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{area_m2}m²</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gold">
              {formatPrice(price, currency)}
            </span>
          </div>
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
