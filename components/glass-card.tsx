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
