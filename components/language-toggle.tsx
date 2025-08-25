"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageToggle() {
  const [language, setLanguage] = useState<"en" | "ar">("en")

  const toggleLanguage = () => {
    const newLang = language === "en" ? "ar" : "en"
    setLanguage(newLang)

    // Update document direction for RTL support
    document.documentElement.setAttribute("dir", newLang === "ar" ? "rtl" : "ltr")
    document.documentElement.setAttribute("lang", newLang)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="glass text-foreground hover:text-gold transition-colors"
    >
      <Globe className="h-4 w-4 mr-2" />
      {language === "en" ? "العربية" : "English"}
    </Button>
  )
}
