# 📚 Avent Properties - Documentation Index

**Purpose:** This index provides a clear overview of our documentation structure, explaining the purpose and usage of each file to ensure proper information organization and easy navigation.

---

## 🎯 Documentation Philosophy

Our documentation follows a **clear separation of concerns**:

- **📋 `/rules` Folder**: **Learning materials for AI** - Business logic, technical standards, and development guidelines that help AI understand the project
- **📊 `/docs` Folder**: **Project status documentation** - Implementation tracking, migration guides, and current project state

**Key Principle**: `/rules` files are for AI learning, `/docs` files reflect actual project status and implementation.

---

## 📁 Documentation Structure

### **📋 `/rules` - AI Learning Materials**

#### `rules/DEVELOPMENT_BLUEPRINT.md`
- **Purpose**: Complete business logic, domain model, and product specifications for AI understanding
- **Content**: Vision, technical foundation, domain model, GraphQL schema, feature roadmap
- **Audience**: AI assistants, product managers, stakeholders
- **Update Frequency**: When business requirements change
- **Usage**: Source of truth for what we're building and why

#### `rules/DEVELOPMENT_WORKFLOW.md`
- **Purpose**: Development methodology and technical processes for AI guidance
- **Content**: Development stages, testing strategy, performance targets, security requirements
- **Audience**: AI assistants, development team, technical leads
- **Update Frequency**: When development processes change
- **Usage**: Guide for how we develop and maintain quality

#### `rules/RULES.md`
- **Purpose**: Coding standards, naming conventions, and best practices for AI
- **Content**: Code style guidelines, React/Next.js patterns, architecture rules, CI/CD practices
- **Audience**: AI assistants, all developers
- **Update Frequency**: When coding standards evolve
- **Usage**: Reference for maintaining consistent code quality

---

### **📊 `/docs` - Project Status Documentation**

#### `docs/IMPLEMENTATION_TRACKER.md`
- **Purpose**: Real-time progress tracking and implementation status
- **Content**: Current phase status, completed tasks, blockers, next steps
- **Audience**: Project managers, development team, stakeholders
- **Update Frequency**: Daily/weekly as progress is made
- **Usage**: **Primary status tracking document**

#### `docs/ENDPOINT_MIGRATION_GUIDE.md`
- **Purpose**: Complete guide for the hybrid GraphQL migration implementation
- **Content**: Migration strategy, performance benefits, usage examples, testing procedures
- **Audience**: Developers, technical leads, architects
- **Update Frequency**: When GraphQL architecture changes
- **Usage**: Reference for understanding and using the hybrid GraphQL approach

#### `docs/DATABASE_SETUP.md`
- **Purpose**: Database configuration and setup instructions
- **Content**: PostgreSQL setup, Prisma configuration, migration procedures, RLS policies
- **Audience**: DevOps, developers setting up environments
- **Update Frequency**: When database setup changes
- **Usage**: Step-by-step database configuration guide

#### `docs/DEPLOYMENT_CONFIG.md`
- **Purpose**: Production deployment and infrastructure configuration
- **Content**: Vercel + Supabase setup, CI/CD pipelines, AWS migration strategy
- **Audience**: DevOps, deployment team
- **Update Frequency**: When infrastructure or deployment changes
- **Usage**: Production deployment reference

---

### **🔧 Technical Implementation Files**

#### `lib/graphql/resolvers-migration-plan.ts`
- **Purpose**: Technical migration plan and status tracking
- **Content**: Which endpoints migrated to Supabase GraphQL vs kept in Apollo Server
- **Audience**: Developers, technical leads
- **Update Frequency**: When migration status changes
- **Usage**: Technical reference for migration decisions and current status

#### `lib/hooks/index.ts`
- **Purpose**: Centralized exports for all Supabase GraphQL hooks
- **Content**: All custom React Query hooks for data fetching
- **Audience**: Frontend developers
- **Update Frequency**: When new hooks are added
- **Usage**: Single import point for all GraphQL hooks

#### `lib/types/graphql.ts`
- **Purpose**: Complete TypeScript type definitions for GraphQL operations
- **Content**: Interfaces for all entities, mutations, queries, and responses
- **Audience**: Frontend developers, TypeScript users
- **Update Frequency**: When GraphQL schema changes
- **Usage**: Type safety for all GraphQL operations

---

## 🔄 Documentation Workflow

### **When to Update Each File:**

#### **📊 `/docs` - Project Status (Update Frequently)**
1. **`docs/IMPLEMENTATION_TRACKER.md`** - Update daily/weekly with progress
2. **`docs/ENDPOINT_MIGRATION_GUIDE.md`** - Update when GraphQL architecture changes
3. **`docs/DATABASE_SETUP.md`** - Update when database configuration changes
4. **`docs/DEPLOYMENT_CONFIG.md`** - Update when infrastructure changes

#### **📋 `/rules` - AI Learning Materials (Update When Standards Change)**
5. **`rules/DEVELOPMENT_BLUEPRINT.md`** - Update when business requirements change
6. **`rules/DEVELOPMENT_WORKFLOW.md`** - Update when development processes change
7. **`rules/RULES.md`** - Update when coding standards evolve

#### **🔧 Technical Implementation Files (Update When Code Changes)**
8. **`lib/graphql/resolvers-migration-plan.ts`** - Update when migration status changes
9. **`lib/hooks/index.ts`** - Update when new hooks are added
10. **`lib/types/graphql.ts`** - Update when GraphQL schema changes

### **Documentation Review Process:**

- **Daily/Weekly**: Update `docs/IMPLEMENTATION_TRACKER.md` with progress
- **Monthly**: Review all `/docs` files for accuracy and completeness
- **Quarterly**: Review `/rules` files for relevance and update standards
- **Before Major Releases**: Update all relevant documentation
- **When Adding New Features**: Update `rules/DEVELOPMENT_BLUEPRINT.md` first

---

## 🎯 Quick Reference Guide

### **For New Developers:**

1. **Start with `README.md`** for project overview
2. **Read `rules/DEVELOPMENT_BLUEPRINT.md`** for business context and requirements
3. **Review `rules/DEVELOPMENT_WORKFLOW.md`** for development process
4. **Check `rules/RULES.md`** for coding standards and best practices
5. **Follow `docs/DATABASE_SETUP.md`** for environment setup
6. **Study `docs/ENDPOINT_MIGRATION_GUIDE.md`** for GraphQL architecture
7. **Review `lib/hooks/index.ts`** for available data fetching hooks
8. **Check `lib/types/graphql.ts`** for TypeScript interfaces

### **For Project Managers:**

1. **Check `docs/IMPLEMENTATION_TRACKER.md`** for current status and progress
2. **Review `rules/DEVELOPMENT_BLUEPRINT.md`** for requirements and roadmap
3. **Reference `rules/DEVELOPMENT_WORKFLOW.md`** for process understanding

### **For DevOps/Deployment:**

1. **Follow `docs/DATABASE_SETUP.md`** for database configuration
2. **Use `docs/DEPLOYMENT_CONFIG.md`** for production deployment
3. **Reference `rules/DEVELOPMENT_WORKFLOW.md`** for deployment stages

### **For GraphQL/Frontend Developers:**

1. **Start with `docs/ENDPOINT_MIGRATION_GUIDE.md`** for architecture overview
2. **Use `lib/hooks/index.ts`** for importing data fetching hooks
3. **Reference `lib/types/graphql.ts`** for TypeScript interfaces
4. **Check `lib/graphql/resolvers-migration-plan.ts`** for migration status
5. **Test with `/test-migration` page** to verify hooks work
6. **Review `lib/supabase/graphql-client.ts`** for client configuration

### **For AI Assistants:**

1. **Read `rules/DEVELOPMENT_BLUEPRINT.md`** to understand business logic and requirements
2. **Study `rules/DEVELOPMENT_WORKFLOW.md`** for development methodology
3. **Follow `rules/RULES.md`** for coding standards and conventions
4. **Check `docs/IMPLEMENTATION_TRACKER.md`** for current project status
5. **Reference `docs/ENDPOINT_MIGRATION_GUIDE.md`** for GraphQL implementation details

---

## 📝 Documentation Maintenance

### **Quality Standards:**

- All files must be clear, concise, and actionable
- Use consistent formatting and structure
- Include examples where helpful
- Keep information up-to-date and accurate
- Cross-reference related information appropriately

### **Version Control:**

- All documentation changes should be committed with descriptive messages
- Use conventional commit format for documentation updates
- Review documentation changes as part of code reviews

---

---

## 🚀 Current Project Status

### **✅ GraphQL Migration (COMPLETED)**

**Migration Summary:**
- **Total Endpoints**: 25
- **Migrated to Supabase GraphQL**: 18 (72%)
- **Kept in Custom Apollo Server**: 7 (28%)
- **Performance Improvement**: 70% reduction in database queries
- **New Hooks Created**: 6 custom React Query hooks
- **Build Status**: ✅ Production ready

**Key Implementation Files:**
- `docs/ENDPOINT_MIGRATION_GUIDE.md` - Complete migration guide
- `lib/hooks/` - Custom React Query hooks for all entities
- `lib/types/graphql.ts` - Complete TypeScript definitions
- `lib/graphql/resolvers-migration-plan.ts` - Migration status tracking
- `app/test-migration/` - Test page for verifying migration

**Architecture Benefits:**
- **Hybrid Approach**: Supabase auto-generated GraphQL + Custom Apollo Server
- **Type Safety**: Full TypeScript support with generated interfaces
- **Performance**: N+1 query elimination with intelligent caching
- **Developer Experience**: Consistent hooks API with IntelliSense

### **📊 Documentation Status**

**Current State:**
- **`/rules` Folder**: 3 files - AI learning materials (stable)
- **`/docs` Folder**: 5 files - Project status documentation (updated regularly)
- **Technical Files**: 3 key implementation files for GraphQL architecture
- **All Documentation**: ✅ Up-to-date and consistent

**Redundancy Eliminated:**
- Clear separation between AI learning materials (`/rules`) and project status (`/docs`)
- No duplicate information between folders
- Consistent update frequencies and purposes

---

**Last Updated**: December 2024
**Next Review**: January 2025
