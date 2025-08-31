import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Share } from "lucide-react";
import { formatLocation } from "@/lib/utils";
import type { Property } from "@/hooks/use-properties";

interface PropertyHeaderProps {
  property: Property;
  onShare?: () => void;
  className?: string;
}

export function PropertyHeader({ property, onShare, className }: PropertyHeaderProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="glass border-gold text-gold">
              {property.property_type}
            </Badge>
          </div>
          <h1 className="heading-luxury text-3xl md:text-4xl text-foreground">
            {property.title}
          </h1>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-5 w-5 mr-2" />
            <span className="text-luxury text-lg">
              {formatLocation(property.city, property.neighborhood)}
            </span>
          </div>
        </div>

        <Button variant="ghost" className="text-foreground hover:text-gold" onClick={onShare}>
          <Share className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}


