import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PropertyNavigationProps {
  backHref?: string;
  backLabel?: string;
  className?: string;
}

export function PropertyNavigation({
  backHref = "/listings",
  backLabel = "Back to Properties",
  className,
}: PropertyNavigationProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <Link href={backHref}>
        <Button variant="ghost" className="text-foreground hover:text-gold">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {backLabel}
        </Button>
      </Link>
    </div>
  );
}
