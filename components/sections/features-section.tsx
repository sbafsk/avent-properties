import React from "react";
import { GlassCard } from "@/components/glass-card";
import { SectionHeader } from "@/components/section-header";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: "$",
    title: "Stable Investment",
    description: "Uruguay offers political stability, strong property rights, and a growing luxury real estate market.",
  },
  {
    icon: "🏖️",
    title: "Pristine Coastline",
    description: "200km of stunning Atlantic coastline with exclusive beaches and world-class amenities.",
  },
  {
    icon: "✈️",
    title: "Easy Access",
    description: "Direct flights from Dubai, favorable time zones, and no visa requirements for UAE residents.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Why Uruguay?"
          subtitle="Discover the perfect blend of European elegance and South American charm in one of the world's most stable investment markets."
          centered
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <GlassCard key={index} variant="premium" className="p-8 text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gold-foreground text-2xl font-bold">
                  {feature.icon}
                </span>
              </div>
              <h3 className="heading-luxury text-xl text-foreground mb-4">
                {feature.title}
              </h3>
              <p className="text-luxury text-muted-foreground">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}


