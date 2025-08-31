import React from "react";
import { GlassCard } from "@/components/glass-card";

interface PropertyDescriptionProps {
  description: string;
  className?: string;
}

export function PropertyDescription({ description, className }: PropertyDescriptionProps) {
  return (
    <GlassCard variant="premium" className={`p-6 ${className}`}>
      <h2 className="heading-luxury text-2xl text-foreground mb-4">
        About This Property
      </h2>
      <p className="text-luxury text-muted-foreground leading-relaxed">
        {description}
      </p>
    </GlassCard>
  );
}


