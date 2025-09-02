# AI Agent Instructions - Avent Properties

> **AI Context**: This file provides guidelines for AI agents working with this project.
> Always check [context.yaml](context.yaml) first for current project status.

## 🎯 **Context Loading Priority**

### **1. Primary Context (Always Load First)**
- **File**: `.ai/context.yaml`
- **Purpose**: Master project context and current status
- **Update Frequency**: Weekly
- **Usage**: Always reference this first for any project-related queries

### **2. Current Status (For Status Queries)**
- **File**: `docs/status/progress.yaml`
- **Purpose**: Machine-readable current project status
- **Update Frequency**: Daily
- **Usage**: When user asks about current progress, priorities, or blockers

### **3. Implementation Details (As Needed)**
- **File**: `docs/architecture/overview.md`
- **Purpose**: Technical architecture and implementation details
- **Update Frequency**: Monthly
- **Usage**: When user asks about technical implementation, architecture, or code structure

### **4. Standards (For Code Generation)**
- **File**: `standards/coding.md`
- **Purpose**: Immutable coding standards and patterns
- **Update Frequency**: Rarely
- **Usage**: When generating code, implementing features, or reviewing code

## 🔍 **Query Routing Guidelines**

### **Status & Progress Queries**
```
User: "What's the current status?"
AI: Check docs/status/progress.yaml first, then provide summary
```

### **Technical Implementation Queries**
```
User: "How does the GraphQL system work?"
AI: Check docs/architecture/overview.md for technical details
```

### **Code Generation Queries**
```
User: "Create a new component for property cards"
AI: Check standards/coding.md for patterns, then generate code
```

### **Project Overview Queries**
```
User: "Tell me about this project"
AI: Check .ai/context.yaml first, then docs/index.md for details
```

## 📋 **AI Behavior Guidelines**

### **Always Do**
1. **Check Context First**: Always load `.ai/context.yaml` before responding
2. **Single Source of Truth**: Never duplicate information across multiple files
3. **Clear References**: Always provide clear file references when citing information
4. **Update Workflow**: Guide users to update the correct files for status changes

### **Never Do**
1. **Duplicate Information**: Don't recreate documentation that already exists
2. **Assume Status**: Don't assume project status without checking current files
3. **Ignore Context**: Don't skip the context loading step
4. **Create Redundancy**: Don't suggest creating multiple files with overlapping information

### **When Uncertain**
1. **Ask for Clarification**: If user request is unclear, ask for specific details
2. **Suggest Context Check**: Guide user to check current status files
3. **Provide File References**: Point to specific documentation files for answers

## 🔄 **Update Workflow for AI Agents**

### **Status Updates**
When user provides status updates:
1. **Update**: `docs/status/progress.yaml`
2. **Sync**: `.ai/context.yaml` (if major changes)
3. **Reference**: Point user to updated files

### **Documentation Changes**
When user requests documentation changes:
1. **Check**: Existing documentation first
2. **Update**: Single source of truth file
3. **Cross-reference**: Update related files if needed
4. **Avoid**: Creating duplicate information

### **Code Standards**
When user asks about coding standards:
1. **Reference**: `standards/coding.md`
2. **Explain**: Standards in context of current project
3. **Apply**: Standards to specific code examples

## 📊 **Project-Specific Guidelines**

### **GraphQL Architecture**
- **Current Status**: Hybrid architecture is complete and production-ready
- **Focus**: Business features, not GraphQL improvements
- **Reference**: `docs/architecture/overview.md` for technical details

### **Development Priorities**
- **Current Phase**: Business Features Development
- **Next Priority**: Tour Reservation System
- **Timeline**: Q1 2025
- **Reference**: `docs/status/progress.yaml` for current priorities

### **Technical Debt**
- **TypeScript Issues**: Low priority, continue with business features
- **Linting**: Complete and working
- **Testing**: Comprehensive test coverage achieved

## 🎯 **Response Templates**

### **Status Query Response**
```
Based on the current project status ([docs/status/progress.yaml](docs/status/progress.yaml)):

**Current Phase**: [Phase Name]
**Completion**: [X]%
**Next Priority**: [Priority Name]
**Timeline**: [Timeline]

**Recent Achievements**:
- [Achievement 1]
- [Achievement 2]

**Current Priorities**:
- [Priority 1] - Deadline: [Date]
- [Priority 2] - Deadline: [Date]
```

### **Technical Query Response**
```
For technical implementation details, see [docs/architecture/overview.md](docs/architecture/overview.md).

**Key Points**:
- [Technical Point 1]
- [Technical Point 2]

**Current Status**: [Status from context.yaml]
**Next Steps**: [Next steps from progress.yaml]
```

### **Code Generation Response**
```
Following the coding standards from [standards/coding.md](standards/coding.md):

**Standards Applied**:
- [Standard 1]
- [Standard 2]

**Generated Code**:
```typescript
[Code here]
```

**Implementation Notes**:
- [Note 1]
- [Note 2]
```

## 🔗 **Quick Reference Links**

- **Master Context**: [.ai/context.yaml](context.yaml)
- **Current Status**: [docs/status/progress.yaml](../docs/status/progress.yaml)
- **Project Overview**: [docs/index.md](../docs/index.md)
- **Architecture**: [docs/architecture/overview.md](../docs/architecture/overview.md)
- **Coding Standards**: [standards/coding.md](../standards/coding.md)
- **Setup Guide**: [docs/guides/setup.md](../docs/guides/setup.md)

---

> **Remember**: Always check `.ai/context.yaml` first for current project context!
