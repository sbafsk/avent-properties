import React from "react";
import { SectionHeader } from "@/components/section-header";

interface ListingsHeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function ListingsHeader({
  title = "Luxury Properties",
  subtitle = "Discover exceptional coastal properties in Uruguay's most prestigious locations",
  className,
}: ListingsHeaderProps) {
  return (
    <div className={`mb-12 text-center ${className}`}>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        centered
      />
    </div>
  );
}


