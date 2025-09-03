# Avent Properties - Luxury Real Estate Platform

A premium coastal properties platform in Uruguay, designed for Dubai investors and high-net-worth individuals.

## 🚀 **Features**

- **Property Listings**: Curated luxury properties with detailed information
- **Virtual Tours**: Interactive property exploration
- **Reservation System**: 10% deposit booking with tour scheduling
- **GraphQL API**: Apollo Server + Supabase SDK integration
- **Authentication**: JWT-based with role-based access control
- **Responsive Design**: Mobile-first approach with modern UI

## 🏗️ **Architecture**

- **Frontend**: Next.js 15 + TypeScript + React 19
- **Styling**: TailwindCSS + shadcn/ui + Radix UI
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **API**: Apollo Server + Supabase SDK
- **State Management**: Redux Toolkit + React Query
- **Forms**: React Hook Form + Zod validation
- **Testing**: Jest + React Testing Library + Playwright
- **Deployment**: Vercel (MVP) → AWS (future)

## 🚀 **Quick Start**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd avent-properties
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in your Supabase credentials
   ```

4. **Run the development server**
   ```bash
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 **Documentation**

- **Complete Guide**: [docs/index.md](docs/index.md)
- **Setup Instructions**: [docs/guides/setup.md](docs/guides/setup.md)
- **Architecture Overview**: [docs/architecture/overview.md](docs/architecture/overview.md)
- **API Reference**: [docs/architecture/api.md](docs/architecture/api.md)

## 🧪 **Testing**

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage

# Run specific test files
yarn test __tests__/graphql/
```

## 🚀 **Development**

```bash
# Type checking
yarn type-check

# Linting
yarn lint

# Build
yarn build

# Start production server
yarn start
```

## 🌟 **Key Benefits**

- **Efficient Database Access**: Supabase SDK for optimized queries
- **Type Safety**: Full TypeScript support with generated Supabase types
- **Performance**: Optimized queries with efficient joins
- **Maintainability**: Clean, standard Apollo patterns
- **Scalability**: Easy to extend with new resolvers

## 🔧 **GraphQL Endpoint**

Access your GraphQL API at `/api/graphql` with:
- **Schema**: Comprehensive property and reservation types
- **Resolvers**: Supabase SDK integration
- **Authentication**: JWT-based with role-based access
- **Business Logic**: Comprehensive validation and rules

## 📊 **Current Status**

- **MVP Features**: ✅ **COMPLETED** - Core functionality operational
- **GraphQL API**: ✅ **COMPLETED** - Apollo Server + Supabase SDK integration
- **MCP Integration**: ✅ **COMPLETED** - AI development assistance operational
- **Testing Suite**: ✅ **COMPLETED** - Comprehensive test coverage
- **Documentation**: ✅ **COMPLETED** - AI-friendly documentation structure

## 🎯 **Next Milestone**

**Tour Reservation System with 10% Deposit**
- Property tour scheduling
- Deposit payment integration
- Email notifications
- Calendar management

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 **License**

This project is proprietary software. All rights reserved.

---

**Built with ❤️ for luxury real estate in Uruguay**