# Development Workflow – Avent Properties

## 🔧 Stage 1 – Foundation Setup

- Use **Yarn** for all dependencies
- Initialize Next.js + TS + App Router
- Add ESLint + Prettier + Husky (pre-commit)
- Configure TailwindCSS + shadcn/ui
- Connect Supabase project (`supabase init`)
- Setup GraphQL server (Apollo/GraphQL Yoga)

---

## 🔐 Stage 2 – Authentication & Access

- Supabase Auth (email/pass, JWT)
- Role-based access (RLS policies):
  - **admin**
  - **client**
  - **agency**
- Next.js middleware → protect routes

---

## 🗄️ Stage 3 – Database & API

- Define schema in Supabase (mirror GraphQL types)
- Implement resolvers (CRUD for Properties, Reservations)
- Stripe integration via Supabase Edge Functions
- Setup caching (Apollo Client + React Query hybrid)

---

## 🏡 Stage 4 – Core Features (MVP)

- Property listing & detail pages
- Reservation flow (tour scheduling + deposit payment)
- Client dashboard (reservations + receipts)
- Agency dashboard (property CRUD, reservation list)
- Admin console (transactions view, audit logs)

---

## 📈 Stage 5 – Testing & QA

- **Unit Tests**: Jest + ts-jest for utils/resolvers
- **Component Tests**: React Testing Library
- **Integration Tests**: GraphQL API resolvers
- **E2E**: Playwright (sign up → browse → reserve → pay)
- **CI/CD**: GitHub Actions run tests on PRs

---

## 🌍 Stage 6 – Deployment

- MVP: Vercel (frontend) + Supabase (backend)
- Future: AWS (RDS, S3, AppSync, ECS)
- Secrets via Vercel & Supabase vaults
- Monitoring: Sentry + Supabase logs
- Alerts: GitHub Actions CI/CD notifications

---

## 📜 Guidelines

- Always use **Yarn** (no npm)
- API must be **GraphQL** only (no REST)
- Supabase RLS for multi-tenant safety
- Prefer Apollo Client hooks in frontend
- Use TypeScript strict mode
- Maintain >80% coverage on domain logic
- Accessibility (ARIA, WCAG 2.1) enforced

---
