# 🏖️ Avent Properties - Luxury Real Estate Platform

**Premium coastal properties in Uruguay for Dubai investors. Discover luxury real estate in Punta del Este, José Ignacio, and Piriápolis.**

## 🎯 Project Overview

Avent Properties is a modern, luxury real estate platform targeting High Net Worth Individuals (HNWIs) from Dubai/UAE for premium properties in Uruguay's most exclusive coastal destinations.

### Key Features
- **Property Listings**: Browse and filter luxury properties with advanced search
- **Tour Reservations**: Book premium tours with 10% deposit system
- **Multi-Role Access**: Client, Agency, and Admin dashboards
- **GraphQL API**: Type-safe API with Supabase backend
- **Modern UI**: Glassmorphism design with gold accents
- **Responsive Design**: Mobile-first approach

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + React 19
- **Styling**: TailwindCSS + shadcn/ui + Radix UI
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **API**: GraphQL with Apollo Server
- **State Management**: Redux Toolkit
- **Forms**: React Hook Form + Zod validation
- **Testing**: Jest + React Testing Library + Playwright
- **Package Manager**: Yarn
- **Deployment**: Vercel (MVP)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Yarn package manager
- Supabase account and project

### 1. Clone and Install
```bash
git clone <repository-url>
cd avent-properties
yarn install
```

### 2. Environment Setup
```bash
cp env.example .env.local
```

Fill in your environment variables:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Avent Properties
```

### 3. Database Setup
1. Create a new Supabase project
2. Run the database migrations (see `rules/DATABASE_SETUP.md`)
3. Set up Row Level Security (RLS) policies
4. Configure authentication settings

### 4. Development
```bash
# Start development server
yarn dev

# Run tests
yarn test

# Run E2E tests
yarn test:e2e

# Type checking
yarn type-check

# Linting and formatting
yarn lint
yarn format
```

## 📁 Project Structure

```
avent-properties/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (GraphQL)
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboards
│   ├── listings/          # Property listings
│   ├── property/          # Property details
│   └── reserve/           # Reservation flow
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Feature components
├── lib/                   # Utilities and configurations
│   ├── graphql/          # GraphQL schema and resolvers
│   ├── slices/           # Redux slices
│   ├── supabase.ts       # Supabase client
│   ├── apollo-client.ts  # Apollo Client config
│   └── store.ts          # Redux store
├── rules/                 # Project documentation
├── tests/                 # Test files
└── public/               # Static assets
```

## 🔐 Authentication & Authorization

The platform supports three user roles:

- **Client**: Browse properties, make reservations, view dashboard
- **Agency**: Manage properties, view reservations, agency dashboard  
- **Admin**: Full access, financial console, user management

Authentication is handled via Supabase Auth with JWT tokens and Row Level Security (RLS) policies.

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts with role-based access
- `properties` - Property listings with details and media
- `agencies` - Real estate agencies
- `tour_reservations` - Tour bookings with deposit tracking
- `transactions` - Financial transactions and commissions
- `contact_requests` - Customer inquiries

## 🎨 Design System

### Colors
- **Primary**: Gold accents (#D4AF37)
- **Background**: Dark theme with glassmorphism
- **Text**: High contrast for accessibility

### Typography
- **Headings**: Playfair Display (luxury feel)
- **Body**: Inter (modern readability)

### Components
- Glassmorphism cards with backdrop blur
- Consistent spacing and typography
- Responsive grid layouts
- Accessible form components

## 🧪 Testing Strategy

- **Unit Tests**: Jest + React Testing Library for components
- **Integration Tests**: GraphQL API resolvers
- **E2E Tests**: Playwright for critical user flows
- **Coverage**: Minimum 80% coverage requirement

## 📦 Available Scripts

```bash
# Development
yarn dev              # Start development server
yarn build            # Build for production
yarn start            # Start production server

# Testing
yarn test             # Run unit tests
yarn test:ci          # Run tests with coverage
yarn test:e2e         # Run E2E tests

# Code Quality
yarn lint             # Run ESLint
yarn format           # Format with Prettier
yarn type-check       # TypeScript type checking

# Git Hooks (automatic)
# pre-commit: lint, format, type-check
# pre-push: full test suite
```

## 🚀 Deployment

### MVP Deployment (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Future AWS Migration
- Database: Amazon RDS (PostgreSQL)
- Storage: S3 + CloudFront
- API: AWS AppSync or Lambda
- Frontend: Amplify or CloudFront

## 📚 Documentation

- `rules/DEVELOPMENT_BLUEPRINT.md` - Business logic and requirements
- `rules/DEVELOPMENT_WORKFLOW.md` - Development process
- `rules/RULES.md` - Coding standards and conventions
- `rules/DOCUMENTATION_INDEX.md` - Documentation overview

## 🤝 Contributing

1. Follow the coding standards in `rules/RULES.md`
2. Write tests for new features
3. Use conventional commit messages
4. Create feature branches from `dev`
5. Submit pull requests for review

## 📄 License

Private project - All rights reserved

---

**Built with ❤️ by Trees in Uruguay**