export interface UserProfile {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    location: string
    preferredLanguage: "en" | "ar"
    investmentBudget: string
    propertyTypes: string[]
    locations: string[]
    membershipTier: "standard" | "premium" | "platinum"
    joinDate: string
    totalInvestment: number
}

export interface Property {
    id: string
    title: string
    location: string
    price: number
    currency: string
    bedrooms: number
    bathrooms: number
    area: number
    type: string
    status: "active" | "pending" | "sold" | "draft"
    featured: boolean
    images: string[]
    description: string
    createdAt: string
    updatedAt: string
}
