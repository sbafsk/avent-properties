import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/section-header";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://picsum.photos/1920/1080?random=1"
          alt="Luxury coastal property in Uruguay"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <GlassCard variant="luxury" padding="xl">
          <SectionHeader
            title="Discover Luxury Coastal Living"
            subtitle="Premium properties in Uruguay's most exclusive coastal destinations. Connecting Dubai investors with extraordinary real estate opportunities."
            centered
            className="mb-8"
          />

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/listings">
              <Button variant="premium" size="lg">
                Browse Properties
              </Button>
            </Link>
            <Link href="/tour-wizard">
              <Button variant="glass" size="lg">
                Schedule Tour
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
