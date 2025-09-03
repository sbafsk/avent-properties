# Development Environment Setup Guide

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- Yarn package manager
- Supabase account and project
- Git

### **1. Clone and Install**
```bash
git clone <repository-url>
cd avent-properties
yarn install
```

### **2. Environment Setup**
```bash
cp .env.example .env.local
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

### **3. Database Setup**
1. Create a new Supabase project
2. Run the database migrations (see `supabase-rls-setup.sql`)
3. Set up Row Level Security (RLS) policies
4. Configure authentication settings

### **4. Development**
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

## 🏗️ **Project Structure**

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

## 🔐 **Authentication & Authorization**

The platform supports three user roles:

- **Client**: Browse properties, make reservations, view dashboard
- **Agency**: Manage properties, view reservations, agency dashboard  
- **Admin**: Full access, financial console, user management

Authentication is handled via Supabase Auth with JWT tokens and Row Level Security (RLS) policies.

## 🗄️ **Database Schema**

### **Core Tables**
- `users` - User accounts with role-based access
- `properties` - Property listings with details and media
- `agencies` - Real estate agencies
- `tour_reservations` - Tour bookings with deposit tracking
- `transactions` - Financial transactions and commissions
- `contact_requests` - Customer inquiries

## 🎨 **Design System**

### **Colors**
- **Primary**: Gold accents (#D4AF37)
- **Background**: Dark theme with glassmorphism
- **Text**: High contrast for accessibility

### **Typography**
- **Headings**: Playfair Display (luxury feel)
- **Body**: Inter (modern readability)

### **Components**
- Glassmorphism cards with backdrop blur
- Consistent spacing and typography
- Responsive grid layouts
- Accessible form components

## 🧪 **Testing Strategy**

### **Test Commands**
```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage

# Run specific test files
yarn test __tests__/graphql/
yarn test __tests__/components/
```

### **Test Coverage**
- **Unit Tests**: Jest + React Testing Library for components
- **Integration Tests**: GraphQL API resolvers
- **E2E Tests**: Playwright for critical user flows
- **Coverage**: Minimum 80% coverage requirement

## 📦 **Available Scripts**

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

## 🚀 **Deployment**

### **MVP Deployment (Vercel)**
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### **Future AWS Migration**
- Database: Amazon RDS (PostgreSQL)
- Storage: S3 + CloudFront
- API: AWS AppSync or Lambda
- Frontend: Amplify or CloudFront

## 🔧 **GraphQL Development**

### **Current Architecture**
- **Apollo Server + Supabase SDK**
- **Standard Apollo patterns**
- **Full TypeScript support**
- **Generated Supabase types**

### **Key Files**
```
lib/graphql/
├── schema.ts              # GraphQL schema definition
├── context.ts             # Apollo context with auth
└── resolvers/
    ├── index.ts           # Resolver aggregation
    ├── queries.ts         # Query resolvers
    └── mutations.ts       # Mutation resolvers
```

### **Development Guidelines**
- Use Supabase SDK calls in resolvers
- Maintain full TypeScript coverage
- Follow standard Apollo patterns
- Write comprehensive tests

## 📚 **Documentation Structure**

**🎯 Complete documentation is organized in the `/docs` folder**

### **Quick Navigation**
- **`docs/index.md`** - **COMPLETE PROJECT OVERVIEW** (Start here!)
- **`docs/status/progress.yaml`** - Current project status and progress
- **`docs/architecture/overview.md`** - Technical architecture details
- **`docs/guides/`** - Implementation guides

### **For AI Assistants & Developers**
- **`rules/`** - Development standards and AI training materials
- **`docs/`** - Project status and implementation guides

**→ See `docs/index.md` for complete documentation structure and navigation**

## 🤖 **AI Development Assistance**

### **MCP Integration**
We use Model Context Protocol (MCP) to enhance AI development assistance with 4-server setup (docs + rules).

**→ See `docs/index.md` for complete MCP setup and testing instructions**

## 🤝 **Contributing**

1. **Follow coding standards** in `standards/coding.md`
2. **Write tests** for new features
3. **Use conventional commit messages**
4. **Create feature branches** from `dev`
5. **Submit pull requests** for review
6. **Update documentation** when making changes

## 📄 **License**

Private project - All rights reserved

---

**Built with ❤️ by Trees in Uruguay**

---

## 🔄 **Documentation Status**

- **Last Updated**: January 2025
- **Documentation**: ✅ **CONSOLIDATED** - Single source of truth in `docs/index.md`
- **MCP Integration**: ✅ **COMPLETE** - AI development assistance operational
- **Next Review**: Monthly or when major changes occur

**📚 For complete documentation, start with `docs/index.md`**

---

## 🎯 **Quick Start**

1. **Read this file** for project overview and setup
2. **Go to `docs/index.md`** for complete documentation
3. **Check `docs/status/progress.yaml`** for current status
4. **Follow setup instructions** above

---

## 🚀 **Recent Achievement**

**SOLID Principles & Enterprise Architecture Complete!** ✅ We've successfully implemented enterprise-grade patterns including Repository Pattern, Validation Builder Pattern, and Custom Error Hierarchy following SOLID principles.

---

**Welcome to Avent Properties! 🏖️**
