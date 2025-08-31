import React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/section-header";

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gold/10 to-gold/5">
      <div className="max-w-4xl mx-auto text-center">
        <GlassCard variant="luxury" padding="xl">
          <SectionHeader
            title="Ready to Invest in Paradise?"
            subtitle="Join hundreds of satisfied investors who have discovered the perfect blend of luxury living and smart investment opportunities in Uruguay."
            centered
            className="mb-8"
          />

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="premium" size="lg">
                Get Started Today
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}


