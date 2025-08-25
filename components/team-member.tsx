import Image from "next/image"
import { GlassCard } from "./glass-card"

interface TeamMemberProps {
  name: string
  role: string
  bio: string
  image: string
}

export function TeamMember({ name, role, bio, image }: TeamMemberProps) {
  return (
    <GlassCard className="p-6 text-center">
      <div className="relative w-24 h-24 mx-auto mb-4">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="rounded-full object-cover" />
      </div>
      <h3 className="heading-luxury text-xl text-foreground mb-1">{name}</h3>
      <p className="text-gold text-luxury text-sm mb-4">{role}</p>
      <p className="text-luxury text-muted-foreground text-sm leading-relaxed">{bio}</p>
    </GlassCard>
  )
}
