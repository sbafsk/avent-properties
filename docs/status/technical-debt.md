# Technical Debt Tracking - Avent Properties

## Overview

This document tracks known technical debt items that have been identified but are not blocking current development. These items should be addressed during future cleanup cycles or when related features are being developed.

---

## Current Technical Debt Items

### 1. React DOM Fill Attribute Warning

**Issue**: Console error in PropertyCard tests: `Received 'true' for a non-boolean attribute 'fill'`

**Location**: 
- `components/property/property-card.tsx`
- `__tests__/components/property-card.test.tsx`

**Description**: 
Despite using correct Next.js Image component with proper `fill` prop, React is still treating it as a DOM attribute. This suggests the issue may be deeper in the component tree or related to how props are being spread.

**Impact**: 
- **Severity**: Low
- **Functional Impact**: None - tests pass, functionality works
- **User Experience**: None - only visible in test console
- **Development Experience**: Minor annoyance during testing

**Status**: 
- **Identified**: ✅
- **Investigated**: ✅ (Attempted fixes with fill prop usage)
- **Root Cause**: 🔍 Unknown - requires deeper investigation
- **Resolution**: ⏳ Pending

**Attempted Fixes**:
1. ✅ Fixed `fill` prop usage in Next.js Image components
2. ✅ Updated Lucide React icon fill classes
3. ❌ Issue persists - deeper investigation needed

**Next Steps**:
1. Investigate if `fill` prop is being spread to DOM elements
2. Check for conflicting component libraries or prop spreading
3. Consider using different approach for conditional icon styling
4. Monitor for similar issues in other components

**Priority**: Low - Can be addressed during future cleanup

---

## Technical Debt Categories

### High Priority
*Items that should be addressed in the next 1-2 sprints*

- None currently identified

### Medium Priority  
*Items that should be addressed in the next quarter*

- None currently identified

### Low Priority
*Items that can be addressed during cleanup cycles*

1. **React DOM Fill Attribute Warning** - PropertyCard tests

---

## Resolution Guidelines

### When to Address Technical Debt

1. **During Feature Development**: When working on related components
2. **Cleanup Cycles**: Dedicated time for technical improvements
3. **Bug Fixes**: When investigating related issues
4. **Performance Optimization**: When improving component performance

### Resolution Criteria

- **High Priority**: Must be resolved before next major release
- **Medium Priority**: Should be resolved within 3 months
- **Low Priority**: Can be addressed when convenient

### Documentation Requirements

- Document the root cause when identified
- Update this file with resolution details
- Remove resolved items from tracking
- Add new items as they are discovered

---

## Monitoring and Updates

**Last Updated**: 2025-01-15  
**Next Review**: 2025-02-15  
**Review Frequency**: Monthly

**Review Process**:
1. Assess current technical debt items
2. Update priorities based on project needs
3. Identify new technical debt items
4. Plan resolution in upcoming sprints

---

## Related Documentation

- [Project Progress](progress.yaml) - Overall project status
- [Architecture Overview](../architecture/overview.md) - System architecture
- [Coding Standards](../../standards/coding.md) - Development guidelines
- [Testing Strategy](../guides/testing.md) - Test implementation details
