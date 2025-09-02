# Avent Properties - Complete Project Documentation

Welcome to the comprehensive documentation for Avent Properties, a premium coastal properties platform in Uruguay designed for Dubai investors and high-net-worth individuals.

## 🎯 **Project Overview**

Avent Properties is a modern, luxury real estate platform targeting High Net Worth Individuals (HNWIs) from Dubai/UAE for premium properties in Uruguay's most exclusive coastal destinations.

### **Key Features**
- **Property Listings**: Browse and filter luxury properties with advanced search
- **Tour Reservations**: Book premium tours with 10% deposit system
- **Multi-Role Access**: Client, Agency, and Admin dashboards
- **GraphQL API**: Direct Apollo Server + Supabase integration
- **Modern UI**: Glassmorphism design with gold accents
- **Responsive Design**: Mobile-first approach

---

## 🏗️ **Architecture Overview**

### **Technology Stack**
- **Frontend**: Next.js 15 + TypeScript + React 19
- **Styling**: TailwindCSS + shadcn/ui + Radix UI
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **API**: Direct Apollo Server + Supabase SDK
- **State Management**: Redux Toolkit + React Query
- **Forms**: React Hook Form + Zod validation
- **Testing**: Jest + React Testing Library + Playwright
- **Deployment**: Vercel (MVP) → AWS (future)

### **GraphQL Architecture**
Our GraphQL implementation uses a **direct Apollo Server + Supabase SDK approach** that provides:

- **Direct Database Access**: No GraphQL-to-GraphQL overhead
- **Type Safety**: Full TypeScript support with generated Supabase types
- **Performance**: Optimized queries with efficient joins
- **Maintainability**: Clean, standard Apollo patterns
- **Scalability**: Easy to extend with new resolvers

---

## 📚 **Documentation Structure**

### **Core Documentation**
- **`docs/index.md`** ← **You are here** - Complete project overview
- **`docs/status/progress.yaml`** - Current project status and progress
- **`docs/architecture/overview.md`** - Detailed technical architecture
- **`docs/guides/setup.md`** - Development environment setup

### **Business Documentation**
- **`docs/business/PRODUCT_OWNER_GUIDE.md`** - Business requirements and roadmap
- **`docs/business/SALES_TEAM_GUIDE.md`** - Sales strategy and market positioning

### **Implementation Guides**
- **`docs/guides/apollo_supabase_integration.md`** - GraphQL implementation guide
- **`docs/guides/graphql-migration-plan.md`** - Migration from hybrid to direct architecture
- **`docs/guides/implementation-checklist.md`** - Quick implementation steps

---

## 🚀 **Getting Started**

### **For Developers**
1. **Setup**: Follow [docs/guides/setup.md](docs/guides/setup.md)
2. **Architecture**: Review [docs/architecture/overview.md](docs/architecture/overview.md)
3. **GraphQL**: Study [docs/guides/apollo_supabase_integration.md](docs/guides/apollo_supabase_integration.md)

### **For Business Stakeholders**
1. **Overview**: Read [docs/business/PRODUCT_OWNER_GUIDE.md](docs/business/PRODUCT_OWNER_GUIDE.md)
2. **Status**: Check [docs/status/progress.yaml](docs/status/progress.yaml)
3. **Roadmap**: Review business requirements and milestones

---

## 📊 **Current Project Status**

### **✅ Completed Features**
- **MVP Core**: Property listings, user authentication, basic UI
- **GraphQL API**: Direct Apollo + Supabase integration
- **Testing Suite**: Comprehensive test coverage
- **Documentation**: AI-friendly documentation structure
- **MCP Integration**: AI development assistance operational

### **🔄 Current Priorities**
- **Tour Reservation System**: 10% deposit booking with tour scheduling
- **Payment Integration**: Stripe integration for deposits
- **Email Notifications**: Automated booking confirmations
- **Calendar Management**: Tour scheduling and availability

### **📈 Success Metrics**
- **Performance**: <200ms GraphQL query response times
- **Type Safety**: 100% TypeScript coverage
- **Test Coverage**: >80% code coverage
- **Documentation**: Single source of truth maintained

---

## 🔧 **Development Workflow**

### **Code Standards**
- **TypeScript**: Strict mode enabled
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint with strict rules
- **Formatting**: Prettier configuration

### **Quality Gates**
- **Pre-commit**: Lint, format, type-check
- **Pre-push**: Full test suite
- **CI/CD**: Automated testing and deployment

---

## 🌟 **Key Benefits of New Architecture**

| **Before (Hybrid)** | **After (Direct)** |
|---------------------|-------------------|
| ❌ Complex routing logic | ✅ Simple, direct resolvers |
| ❌ GraphQL-to-GraphQL overhead | ✅ Direct database calls |
| ❌ Performance bottlenecks | ✅ Optimized queries |
| ❌ Hard to maintain | ✅ Standard Apollo patterns |
| ❌ Type safety issues | ✅ Full TypeScript support |

---

## 🚀 **Quick Start Commands**

```bash
# Development
yarn dev              # Start development server
yarn build            # Build for production
yarn start            # Start production server

# Testing
yarn test             # Run unit tests
yarn test:watch       # Run tests in watch mode
yarn test:coverage    # Run tests with coverage

# Code Quality
yarn lint             # Run ESLint
yarn type-check       # TypeScript type checking

# GraphQL Testing
yarn test __tests__/graphql/  # Test GraphQL resolvers
```

---

## 🤖 **AI Development Assistance**

### **MCP Integration**
We use Model Context Protocol (MCP) to enhance AI development assistance with comprehensive project context.

**MCP Servers Configured:**
- **`avent-docs`** - Access to all documentation
- **`avent-ai`** - AI context and instructions
- **`avent-standards`** - Coding standards and patterns
- **`avent-root`** - Overall project structure

---

## 📞 **Getting Help**

### **For Technical Issues**
1. Check the [setup guide](docs/guides/setup.md)
2. Review [architecture documentation](docs/architecture/overview.md)
3. Run tests to identify issues: `yarn test`

### **For Business Questions**
1. Review [product owner guide](docs/business/PRODUCT_OWNER_GUIDE.md)
2. Check [current status](docs/status/progress.yaml)
3. Contact project stakeholders

---

## 🎯 **Next Steps**

1. **Review this documentation** to understand the project
2. **Set up your development environment** using the setup guide
3. **Explore the GraphQL implementation** with the integration guide
4. **Contribute to the project** following our standards

---

**Welcome to Avent Properties! 🏖️**

*Built with ❤️ for luxury real estate in Uruguay*
