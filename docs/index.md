# Avent Properties - Project Documentation

> **AI Context**: This is the single source of truth for project documentation.
> For current status: see [docs/status/progress.yaml](status/progress.yaml)
> For architecture details: see [docs/architecture/overview.md](architecture/overview.md)

## 🎯 **Project Overview**

**Avent Properties** is a premium real estate investment platform connecting Dubai high-net-worth individuals with exclusive Uruguayan properties. The platform features a hybrid GraphQL architecture combining Supabase's auto-generated GraphQL with custom Apollo Server for complex business logic.

## 🚀 **Current Status**

- **Phase**: Business Features Development
- **Completion**: 85% (Foundation, GraphQL, Testing complete)
- **Next Priority**: Tour Reservation System MVP
- **Timeline**: Q1 2025

> **Quick Status Check**: [Current Progress](status/progress.yaml)

## 🏗️ **Architecture Overview**

### **Technology Stack**
- **Frontend**: Next.js 15 + TypeScript + TailwindCSS
- **Backend**: Supabase (MVP) → AWS (planned)
- **API**: Hybrid GraphQL (Supabase + Apollo Server)
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth with JWT
- **Deployment**: Vercel + Supabase

### **Key Architectural Decisions**
- **Hybrid GraphQL**: Simple operations via Supabase, complex logic via Apollo
- **Performance Monitoring**: Real-time query performance tracking
- **Batch Query Optimization**: Reduced database round trips
- **Fallback Mechanisms**: Graceful degradation when hybrid resolver fails

> **Detailed Architecture**: [System Architecture](architecture/overview.md)

## 📚 **Documentation Structure**

```
docs/
├── index.md                    # This file - Single entry point
├── status/                     # Current project status
│   └── progress.yaml          # Machine-readable status
├── architecture/               # Technical implementation
│   ├── overview.md            # System architecture
│   ├── database.md            # Data model
│   └── api.md                 # API specifications
└── guides/                     # How-to documentation
    ├── setup.md               # Environment setup
    └── deployment.md          # Deployment processes
```

## 🔧 **Getting Started**

### **For Developers**
1. **Environment Setup**: [Setup Guide](guides/setup.md)
2. **Architecture Understanding**: [Architecture Overview](architecture/overview.md)
3. **Current Status**: [Progress Tracking](status/progress.yaml)

### **For AI Agents**
1. **Primary Context**: [.ai/context.yaml](../../.ai/context.yaml)
2. **Current Status**: [docs/status/progress.yaml](status/progress.yaml)
3. **Implementation Details**: [Architecture Files](architecture/)

## 📋 **Current Priorities**

1. **Tour Reservation System** (Deadline: Jan 30, 2025)
   - Complete tour booking functionality
   - Property integration
   - Agent management dashboard

2. **Property Management Enhancement** (Deadline: Feb 15, 2025)
   - Advanced property features
   - Image management
   - Pricing optimization

3. **User Experience Optimization** (Deadline: Feb 28, 2025)
   - UI/UX improvements
   - Performance optimization
   - Mobile responsiveness

## 🎯 **Success Metrics**

- **Foundation**: ✅ Complete (MVP, Authentication, UI Components)
- **GraphQL**: ✅ Complete (Hybrid Architecture, Testing, Performance)
- **Testing**: ✅ Complete (Jest, ESLint, Unit Tests)
- **Business Features**: 🚧 In Progress (Tour Reservations, Property Management)

## 🔗 **Quick Links**

- **Current Status**: [Progress Tracker](status/progress.yaml)
- **Architecture**: [System Overview](architecture/overview.md)
- **Setup Guide**: [Development Environment](guides/setup.md)
- **API Reference**: [GraphQL Schema](architecture/api.md)

---

> **Last Updated**: January 15, 2025
> **Next Review**: January 20, 2025
> **Status**: Active Development
