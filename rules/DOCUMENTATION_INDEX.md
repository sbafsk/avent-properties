# 📚 Avent Properties - Documentation Index

**Purpose:** This index provides a clear overview of our documentation structure, explaining the purpose and usage of each file to ensure proper information organization and easy navigation.

---

## 🎯 Documentation Philosophy

Our documentation follows a **separation of concerns** principle:

- **📋 Static Reference Files**: Business logic, technical standards, and configuration guides that remain stable
- **📊 Dynamic Progress File**: Implementation tracking and status updates that change frequently

**Rule of Thumb**: Only `IMPLEMENTATION_TRACKER.md` should be updated regularly. All other files serve as authoritative reference material.

---

## 📁 Documentation Structure

### **🏠 Project Overview & Quick Start**

#### `README.md`

- **Purpose**: Project introduction, features, and quick setup guide
- **Content**: Tech stack, installation, project structure, design system
- **Audience**: New developers, stakeholders, quick reference
- **Update Frequency**: When project structure or tech stack changes
- **Usage**: First file to read when joining the project

---

### **💼 Business Logic & Product Requirements**

#### `rules/DEVELOPMENT_BLUEPRINT.md`

- **Purpose**: Complete business logic, domain model, and product specifications
- **Content**: Data schema, feature requirements, business rules, product roadmap
- **Audience**: Product managers, developers, stakeholders
- **Update Frequency**: When business requirements change
- **Usage**: Source of truth for what we're building and why

---

### **⚙️ Technical Standards & Development Process**

#### `rules/DEVELOPMENT_WORKFLOW.md`

- **Purpose**: Development methodology, quality standards, and technical processes
- **Content**: Development stages, testing strategy, performance targets, security requirements
- **Audience**: Development team, technical leads
- **Update Frequency**: When development processes or standards change
- **Usage**: Guide for how we develop and maintain quality

---

### **🎨 Code Style & Conventions**

#### `rules/RULES.md`

- **Purpose**: Coding standards, naming conventions, and best practices
- **Content**: Code style guidelines, React/Next.js patterns, architecture rules
- **Audience**: All developers working on the project
- **Update Frequency**: When coding standards evolve
- **Usage**: Reference for maintaining consistent code quality

---

### **🏗️ Infrastructure & Configuration**

#### `rules/DATABASE_SETUP.md`

- **Purpose**: Database configuration and setup instructions
- **Content**: PostgreSQL setup, Prisma configuration, migration procedures
- **Audience**: DevOps, developers setting up environments
- **Update Frequency**: When database setup changes
- **Usage**: Step-by-step database configuration guide

#### `rules/DEPLOYMENT_CONFIG.md`

- **Purpose**: Production deployment and infrastructure configuration
- **Content**: Supabase & AWS setup, CI/CD pipelines, environment management
- **Audience**: DevOps, deployment team
- **Update Frequency**: When infrastructure or deployment changes
- **Usage**: Production deployment reference

---

### **📊 Progress Tracking & Status**

#### `rules/IMPLEMENTATION_TRACKER.md`

- **Purpose**: Real-time progress tracking and implementation status
- **Content**: Current phase status, completed tasks, blockers, next steps
- **Audience**: Project managers, development team, stakeholders
- **Update Frequency**: Daily/weekly as progress is made
- **Usage**: **ONLY file that should be updated regularly**

---

## 🔄 Documentation Workflow

### **When to Update Each File:**

1. **`rules/IMPLEMENTATION_TRACKER.md`** - Update daily/weekly with progress
2. **`README.md`** - Update when project structure or tech stack changes
3. **`rules/DEVELOPMENT_BLUEPRINT.md`** - Update when business requirements change
4. **`rules/DEVELOPMENT_WORKFLOW.md`** - Update when development processes change
5. **`rules/RULES.md`** - Update when coding standards evolve
6. **`rules/DATABASE_SETUP.md`** - Update when database configuration changes
7. **`rules/DEPLOYMENT_CONFIG.md`** - Update when infrastructure changes

### **Documentation Review Process:**

- **Weekly**: Review `rules/IMPLEMENTATION_TRACKER.md` for accuracy
- **Monthly**: Review all static files for relevance and completeness
- **Before Major Releases**: Update all relevant documentation
- **When Adding New Features**: Update `rules/DEVELOPMENT_BLUEPRINT.md` first

---

## 🎯 Quick Reference Guide

### **For New Developers:**

1. Start with `README.md`
2. Read `rules/DEVELOPMENT_BLUEPRINT.md` for business context
3. Review `rules/DEVELOPMENT_WORKFLOW.md` for development process
4. Check `rules/RULES.md` for coding standards
5. Follow `rules/DATABASE_SETUP.md` for environment setup

### **For Project Managers:**

1. Check `rules/IMPLEMENTATION_TRACKER.md` for current status
2. Review `rules/DEVELOPMENT_BLUEPRINT.md` for requirements
3. Reference `rules/DEVELOPMENT_WORKFLOW.md` for process understanding

### **For DevOps/Deployment:**

1. Follow `rules/DATABASE_SETUP.md` for database configuration
2. Use `rules/DEPLOYMENT_CONFIG.md` for production deployment
3. Reference `rules/DEVELOPMENT_WORKFLOW.md` for deployment stages

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

**Last Updated**: [Current Date]
**Next Review**: [Monthly Review Date]
