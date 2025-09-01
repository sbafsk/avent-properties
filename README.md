# 🏖️ Avent Properties - Luxury Real Estate Platform

**Premium coastal properties in Uruguay for Dubai investors. Discover luxury real estate in Punta del Este, José Ignacio, and Piriápolis.**

## 🎯 Project Overview

Avent Properties is a modern, luxury real estate platform targeting High Net Worth Individuals (HNWIs) from Dubai/UAE for premium properties in Uruguay's most exclusive coastal destinations.

### Key Features
- **Property Listings**: Browse and filter luxury properties with advanced search
- **Tour Reservations**: Book premium tours with 10% deposit system
- **Multi-Role Access**: Client, Agency, and Admin dashboards
- **GraphQL API**: Hybrid architecture with Supabase backend
- **Modern UI**: Glassmorphism design with gold accents
- **Responsive Design**: Mobile-first approach

---

## 📚 **Documentation & Getting Started**

**🎯 For complete project documentation, start with `docs/README.md`**

This root README provides quick setup instructions. For comprehensive documentation including:
- Current project status and progress
- Development standards and guidelines
- Business requirements and roadmap
- MCP integration setup
- Technical implementation details

**→ Go to `docs/README.md` for the complete picture**

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + React 19
- **Styling**: TailwindCSS + shadcn/ui + Radix UI
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **API**: Hybrid GraphQL (Supabase auto-generated + Custom Apollo Server)
- **State Management**: Redux Toolkit + React Query
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
cp env.example .env
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
2. Run the database migrations (see `docs/DATABASE_SETUP.md`)
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
│   ├── hooks/            # Custom React hooks
│   ├── slices/           # Redux slices
│   ├── supabase.ts       # Supabase client
│   ├── apollo-client.ts  # Apollo Client config
│   └── store.ts          # Redux store
├── rules/                 # AI learning materials and development standards
├── docs/                  # Project status and implementation tracking
├── __tests__/            # Test files
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

## 📚 Documentation Structure

**🎯 Complete documentation is organized in the `/docs` folder**

### **Quick Navigation**
- **`docs/README.md`** - **COMPLETE PROJECT OVERVIEW** (Start here!)
- **`docs/IMPLEMENTATION_TRACKER.md`** - Current project status and progress
- **`docs/FOLDER_STRUCTURE.md`** - Quick navigation guide
- **`docs/MAINTENANCE_GUIDE.md`** - How to keep docs aligned

### **For AI Assistants & Developers**
- **`rules/`** - Development standards and AI training materials
- **`docs/`** - Project status and implementation guides

**→ See `docs/README.md` for complete documentation structure and navigation**

## 🤖 AI Development Assistance

### **MCP Integration**
We use Model Context Protocol (MCP) to enhance AI development assistance with 2-server setup (docs + rules).

**→ See `docs/README.md` for complete MCP setup and testing instructions**

## 🤝 Contributing

1. **Follow coding standards** in `rules/RULES.md`
2. **Write tests** for new features
3. **Use conventional commit messages**
4. **Create feature branches** from `dev`
5. **Submit pull requests** for review
6. **Update documentation** when making changes

**→ See `docs/MAINTENANCE_GUIDE.md` for documentation update workflow**

## 📄 License

Private project - All rights reserved

---

**Built with ❤️ by Trees in Uruguay**

---

## 🔄 Documentation Status

- **Last Updated**: January 2025
- **Documentation**: ✅ **CONSOLIDATED** - Single source of truth in `docs/README.md`
- **MCP Integration**: ✅ **COMPLETED** - AI development assistance operational
- **Next Review**: Monthly or when major changes occur

**📚 For complete documentation, start with `docs/README.md`**

---

## 🎯 **Quick Start**

1. **Read this file** for project overview and setup
2. **Go to `docs/README.md`** for complete documentation
3. **Check `docs/IMPLEMENTATION_TRACKER.md`** for current status
4. **Follow `docs/MAINTENANCE_GUIDE.md`** for keeping docs updated

---

## 🚀 **Recent Achievement**

**MCP Integration Complete!** ✅ AI development assistance is now operational, providing enhanced context and better code generation for the Avent Properties project.