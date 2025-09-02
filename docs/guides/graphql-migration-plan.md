# GraphQL Migration Plan: Hybrid → Direct Apollo + Supabase

## 🎯 **Migration Overview**

**From:** Complex hybrid GraphQL (Supabase auto-generated + Custom Apollo Server)  
**To:** Clean, direct Apollo Server + Supabase SDK integration

## 📋 **Pre-Migration Checklist**

### **Current State Analysis**
- [ ] Audit existing GraphQL queries and mutations
- [ ] Identify performance bottlenecks
- [ ] Document current business logic in resolvers
- [ ] Review authentication and authorization patterns

### **Dependencies Update**
```bash
# Remove hybrid resolver dependencies
npm uninstall @graphql-tools graphql-request

# Ensure core dependencies are up to date
npm install @apollo/server@^4.9.5 graphql@^16.8.1
npm install @supabase/supabase-js@^2.38.4
```

## 🔄 **Phase 1: Schema Consolidation**

### **Step 1.1: Generate Supabase Types**
```bash
# Generate TypeScript types from your Supabase schema
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts
```

### **Step 1.2: Create Unified Schema**
- **File:** `lib/graphql/schema.ts`
- **Action:** Replace current schema with the new unified schema from the guide
- **Focus:** Single source of truth for all GraphQL types

### **Step 1.3: Remove Hybrid Resolver Dependencies**
- **Files to Delete:**
  - `lib/graphql/hybrid-resolver.ts`
  - `lib/graphql/enhanced-resolvers.ts`
  - `lib/graphql/performance-monitor.ts`
  - `lib/graphql/batch-query.ts`

## 🏗️ **Phase 2: Context & Authentication**

### **Step 2.1: Create New Context**
- **File:** `lib/graphql/context.ts`
- **Action:** Implement the new context system from the guide
- **Features:** Supabase client, user authentication, role-based access

### **Step 2.2: Update Apollo Server Route**
- **File:** `app/api/graphql/route.ts`
- **Action:** Replace with new server configuration
- **Focus:** Clean, simple setup without hybrid complexity

## ⚙️ **Phase 3: Resolver Implementation**

### **Step 3.1: Query Resolvers**
- **File:** `lib/graphql/resolvers/queries.ts`
- **Action:** Implement all query resolvers using direct Supabase calls
- **Focus:** Performance, proper error handling, authentication guards

### **Step 3.2: Mutation Resolvers**
- **File:** `lib/graphql/resolvers/mutations.ts`
- **Action:** Implement all mutation resolvers with business logic
- **Focus:** Input validation, business rules, proper error responses

### **Step 3.3: Field Resolvers**
- **File:** `lib/graphql/resolvers/fields.ts`
- **Action:** Handle relationship resolution (agency → properties, etc.)
- **Focus:** Efficient data fetching, avoiding N+1 queries

## 🧪 **Phase 4: Testing & Validation**

### **Step 4.1: Update Test Suite**
- **Action:** Modify existing Jest tests to work with new resolvers
- **Focus:** Mock Supabase client, test business logic, verify performance

### **Step 4.2: Integration Testing**
- **Action:** Test all GraphQL operations end-to-end
- **Focus:** Authentication, data consistency, error handling

### **Step 4.3: Performance Validation**
- **Action:** Compare query response times
- **Focus:** Database query efficiency, caching effectiveness

## 🚀 **Phase 5: Deployment & Cleanup**

### **Step 5.1: Gradual Rollout**
- **Strategy:** Deploy to staging first, then production
- **Monitoring:** Watch for errors, performance metrics

### **Step 5.2: Legacy Code Removal**
- **Action:** Remove all hybrid resolver files
- **Action:** Clean up unused dependencies
- **Action:** Update documentation

## 📁 **New File Structure**

```
lib/graphql/
├── schema.ts                 # Unified GraphQL schema
├── context.ts                # Apollo context with Supabase
├── resolvers/
│   ├── index.ts             # Resolver aggregation
│   ├── queries.ts           # Query resolvers
│   ├── mutations.ts         # Mutation resolvers
│   └── fields.ts            # Field resolvers
└── database.types.ts        # Supabase generated types
```

## ⚠️ **Migration Risks & Mitigation**

### **Risk 1: Breaking Changes**
- **Mitigation:** Comprehensive testing, gradual rollout
- **Fallback:** Keep old system running until new one is stable

### **Risk 2: Performance Regression**
- **Mitigation:** Performance testing, query optimization
- **Monitoring:** Real-time performance metrics

### **Risk 3: Data Inconsistency**
- **Mitigation:** Thorough integration testing
- **Validation:** Data integrity checks

## 🎯 **Success Criteria**

### **Technical Metrics**
- [ ] All GraphQL operations working correctly
- [ ] Response times improved or maintained
- [ ] Error rates reduced
- [ ] Code complexity decreased

### **Business Metrics**
- [ ] No disruption to user experience
- [ ] All features functional
- [ ] Improved development velocity
- [ ] Reduced maintenance overhead

## 📅 **Timeline Estimate**

| **Phase** | **Duration** | **Dependencies** |
|-----------|--------------|------------------|
| **Phase 1** | 2-3 days | Supabase access, schema review |
| **Phase 2** | 1-2 days | Authentication setup |
| **Phase 3** | 3-5 days | Resolver implementation |
| **Phase 4** | 2-3 days | Testing and validation |
| **Phase 5** | 1-2 days | Deployment and cleanup |

**Total Estimated Time: 9-15 days**

## 🚀 **Next Steps**

1. **Review this migration plan** with your team
2. **Set up staging environment** for testing
3. **Begin Phase 1** - Schema consolidation
4. **Monitor progress** and adjust timeline as needed

## 📚 **Reference Materials**

- **Implementation Guide:** `docs/guides/apollo_supabase_integration.md`
- **Current Schema:** `lib/graphql/schema.ts`
- **Supabase Documentation:** [supabase.com/docs](https://supabase.com/docs)
- **Apollo Server Docs:** [apollographql.com/docs/apollo-server](https://www.apollographql.com/docs/apollo-server/)
