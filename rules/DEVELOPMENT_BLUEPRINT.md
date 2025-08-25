# Avent Properties – Product & Engineering Blueprint

**Purpose:** Full specification of the MVP architecture, business logic, data model, and product roadmap.  
**Scope:** Supabase as MVP backend with GraphQL API, future migration to AWS, business logic, features, roadmap.

---

## 🎯 Vision & Context

- **Product:** Avent Properties – curated luxury real estate tours in Uruguay (Punta del Este, José Ignacio, Piriápolis).
- **Market:** HNWIs based in Dubai/UAE, international capital movers.
- **Experience:** Clients browse exclusive listings, reserve premium tours (10% deposit), and potentially purchase units.
- **Revenue:** 3% + VAT from both sides (buyer/seller) on successful transactions.

---

## 🏗️ Technical Foundation

- **Framework:** Next.js (latest App Router) + TypeScript
- **Package Manager:** Yarn
- **Database:** Supabase (Postgres + Auth + Storage) → migrate to AWS RDS + S3 later
- **API Layer:** GraphQL (Apollo Server or Yoga) hosted via Supabase Functions (MVP) → move to AWS Lambda/AppSync later
- **Auth:** Supabase Auth (JWT + RLS policies)
- **Payments:** Stripe (deposits, commissions)
- **Storage:** Supabase Storage (property images, docs)
- **Hosting:** Vercel (MVP) → AWS (future)
- **CI/CD:** GitHub Actions → Vercel (MVP) → AWS CodePipeline (future)

---

## 📊 Domain Model

### Core Entities

- **User** (client, agency, admin)
- **Agency** (local partner, owns properties)
- **Property** (luxury unit details, media, status)
- **TourReservation** (10% deposit, travel package)
- **Transaction** (deposits, commissions, VAT)
- **ContactRequest** (inquiries from clients)
- **AuditLog** (actions, compliance trail)

---

## 🔌 GraphQL API Schema (Excerpt)

```graphql
type User {
  id: ID!
  role: UserRole!
  name: String!
  email: String!
  preferences: JSON
  reservations: [TourReservation!]
}

enum UserRole {
  ADMIN
  CLIENT
  AGENCY
}

type Property {
  id: ID!
  title: String!
  description: String!
  price: Float!
  currency: String!
  city: String!
  neighborhood: String
  propertyType: String!
  bedrooms: Int
  bathrooms: Int
  areaM2: Int
  amenities: [String!]
  images: [String!]
  status: PropertyStatus!
}

enum PropertyStatus {
  AVAILABLE
  RESERVED
  SOLD
}

type TourReservation {
  id: ID!
  user: User!
  property: Property!
  scheduledDate: String!
  depositAmount: Float!
  status: ReservationStatus!
}

enum ReservationStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

type Transaction {
  id: ID!
  amount: Float!
  type: TransactionType!
  status: TxStatus!
  createdAt: String!
}

enum TransactionType {
  DEPOSIT
  COMMISSION
  REFUND
}
enum TxStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}
```

## Feature Roadmap

MVP (Supabase + GraphQL + Vercel)

✅ Public property listings (filters, detail view)

✅ Auth (Supabase, JWT, role-based)

✅ Tour reservation flow (10% Stripe deposit)

✅ Agency property CRUD

✅ Admin financial console (read-only v1)

✅ GraphQL API with Supabase as data source

✅ CI/CD with GitHub → Vercel

Phase 2 (Expansion)

Referrals module (unique links, benefits)

Matching engine (preferences → recommendations)

Favorites, compare, export

Multilingual (EN/ES/AR)

Phase 3 (AWS Migration)

Migrate DB → Amazon RDS (Postgres)

Migrate storage → S3

API → AWS AppSync or Apollo Gateway on ECS

Deploy frontend → Amplify or CloudFront

Advanced observability (CloudWatch + Datadog)

✅ Acceptance Checklist

GraphQL API live with Supabase integration

Stripe deposit flow tested (10% rule)

RLS policies secure (agency can only edit its properties)

Supabase backups enabled

CI/CD pipeline green (tests + deploy)
