import React from "react";
import { GlassCard } from "@/components/glass-card";

interface PropertyLocationProps {
  city: string;
  neighborhood?: string;
  className?: string;
}

export function PropertyLocation({ city, neighborhood, className }: PropertyLocationProps) {
  return (
    <GlassCard variant="premium" className={`p-6 ${className}`}>
      <h2 className="heading-luxury text-2xl text-foreground mb-4">
        Location
      </h2>
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
        <p className="text-muted-foreground">Interactive Map Coming Soon</p>
      </div>
      <div className="space-y-2">
        <p className="text-luxury text-foreground">
          Located in the heart of {city}&apos;s most exclusive neighborhood
          {neighborhood && `, ${neighborhood}`}
        </p>
        <p className="text-luxury text-muted-foreground text-sm">
          Walking distance to premium restaurants, golf courses, and cultural attractions
        </p>
      </div>
    </GlassCard>
  );
}
