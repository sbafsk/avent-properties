import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
  centered?: boolean
}

export function SectionHeader({ title, subtitle, className, centered = false }: SectionHeaderProps) {
  return (
    <div className={cn("space-y-2", centered && "text-center", className)}>
      <h2 className="heading-luxury text-3xl md:text-4xl lg:text-5xl text-foreground">{title}</h2>
      <div className={cn("h-1 w-20 bg-gold rounded-full", centered && "mx-auto")} />
      {subtitle && <p className="text-luxury text-lg text-muted-foreground max-w-2xl">{subtitle}</p>}
    </div>
  )
}
