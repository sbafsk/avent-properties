# AI Agent Instructions - Avent Properties

## 🎯 **Project Context**

You are assisting with **Avent Properties**, a luxury real estate platform in Uruguay designed for Dubai investors and high-net-worth individuals.

## 🏗️ **Current Architecture**

**Apollo Server + Supabase SDK Integration**
- **GraphQL**: Apollo Server with Supabase SDK calls
- **Database**: PostgreSQL via Supabase with Row Level Security
- **Authentication**: JWT-based with role-based access control
- **Type Safety**: Full TypeScript support with generated Supabase types

## 🚀 **Key Benefits of Current Architecture**

| **Aspect** | **Benefit** |
|------------|-------------|
| **Performance** | Efficient database access via Supabase SDK |
| **Type Safety** | Full TypeScript support with generated types |
| **Maintainability** | Standard Apollo patterns, clean code |
| **Scalability** | Easy to extend with new resolvers |
| **Testing** | Comprehensive test coverage |

## 📊 **Current Status**

- **MVP Features**: ✅ **COMPLETED** - Core functionality operational
- **GraphQL API**: ✅ **COMPLETED** - Apollo Server + Supabase SDK integration
- **Testing Suite**: ✅ **COMPLETED** - Comprehensive test coverage
- **Documentation**: ✅ **COMPLETED** - AI-friendly documentation structure
- **MCP Integration**: ✅ **COMPLETED** - AI development assistance operational
- **SOLID Principles**: ✅ **COMPLETED** - Enterprise architecture patterns implemented

## 🎯 **Current Priorities**

1. **Tour Reservation System**: 10% deposit booking with tour scheduling
2. **Payment Integration**: Stripe integration for deposits
3. **Email Notifications**: Automated booking confirmations
4. **Calendar Management**: Tour scheduling and availability

## 🔧 **Development Guidelines**

### **Code Quality**
- **TypeScript**: Strict mode enabled, no `any` types
- **Testing**: Jest + React Testing Library, >80% coverage
- **Linting**: ESLint with strict rules
- **Formatting**: Prettier configuration

### **GraphQL Development**
- **Resolvers**: Supabase SDK calls
- **Type Safety**: Use generated `Database` types
- **Authentication**: JWT validation in context
- **Error Handling**: Proper GraphQL error responses

### **File Organization**
```
lib/graphql/
├── schema.ts              # GraphQL schema definition
├── context.ts             # Apollo context with auth
└── resolvers/
    ├── index.ts           # Resolver aggregation
    ├── queries.ts         # Query resolvers
    └── mutations.ts       # Mutation resolvers
```

## 📚 **Documentation Structure**

- **`docs/index.md`** - Complete project overview
- **`docs/status/progress.yaml`** - Current project status
- **`docs/architecture/overview.md`** - Technical architecture
- **`docs/guides/`** - Implementation guides

## 🤖 **MCP Integration**

4 MCP servers configured for comprehensive context:
- **`avent-docs`** - Access to all documentation
- **`avent-ai`** - AI context and instructions
- **`avent-standards`** - Coding standards and patterns
- **`avent-root`** - Overall project structure

## 🚫 **What NOT to Do**

- ❌ Don't reference hybrid GraphQL architecture
- ❌ Don't suggest complex routing approaches
- ❌ Don't ignore TypeScript type safety
- ❌ Don't skip testing for new features
- ❌ Don't create duplicate documentation

## ✅ **What TO Do**

- ✅ Use Supabase SDK calls in resolvers
- ✅ Maintain full TypeScript coverage
- ✅ Follow standard Apollo patterns
- ✅ Write comprehensive tests
- ✅ Update documentation when making changes
- ✅ Use the new `Database` types from `lib/database.types.ts`
- ✅ Follow SOLID principles and established patterns

## 🔍 **When in Doubt**

1. **Check current documentation** in `docs/`
2. **Review existing resolvers** in `lib/graphql/resolvers/`
3. **Use generated types** from `lib/database.types.ts`
4. **Follow Apollo Server best practices**
5. **Maintain clean, maintainable code**
6. **Apply SOLID principles** from `standards/patterns.md`

## 📞 **Getting Help**

- **Documentation**: Start with `docs/index.md`
- **Architecture**: Review `docs/architecture/overview.md`
- **Status**: Check `docs/status/progress.yaml`
- **Standards**: Refer to `standards/coding.md`
- **Patterns**: Review `standards/patterns.md`

---

**Remember**: We have a clean, maintainable Apollo Server + Supabase SDK implementation with enterprise-grade SOLID principles. Keep it simple, maintainable, and type-safe! 🚀
