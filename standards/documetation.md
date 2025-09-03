# Documentation Governance Standards

## Core Principles

### 1. Single Source of Truth (SSOT)
- **One document per topic** - Never create multiple documents covering the same subject
- **Central reference system** - All information must link back to authoritative sources
- **No duplication** - If information exists elsewhere, reference it rather than repeat it

### 2. Hierarchical Information Architecture
- **Root README.md** - Project overview and navigation hub
- **docs/** - Implementation details and guides
- **standards/** - Immutable governance and coding standards (THIS folder)

### 3. Documentation Creation Restrictions
- **BEFORE creating any document**: Check if the information already exists
- **BEFORE expanding content**: Verify it's not covered in existing documentation
- **UPDATE existing documents** rather than creating new ones

---

## Mandatory Pre-Creation Checklist

### Before Creating ANY Document:

1. **Does this information already exist?**
   - Check README.md
   - Review docs/ directory
   - Verify standards/ directory
   - Search existing content for keywords

2. **Can this be added to an existing document?**
   - Update existing sections instead of new files
   - Extend current documents with new information
   - Merge related content into single sources

3. **Is this truly necessary?**
   - Does it solve a specific problem?
   - Will it be referenced regularly?
   - Is it actionable information?

4. **Where does it belong in the hierarchy?**
   - Root level (project overview only)
   - docs/ (implementation details)
   - standards/ (governance rules)

---

## Document Type Restrictions

### ALLOWED Document Types:

#### Root Level (Maximum 1 file)
- `README.md` - Project overview and navigation ONLY

#### docs/ Directory Structure
```
docs/
├── status/
│   └── progress.yaml          # Current state ONLY
├── architecture/
│   └── overview.md           # Technical implementation ONLY
├── design-system/
│   └── components.md         # UI/UX guidelines ONLY
└── guides/
    └── setup.md              # How-to instructions ONLY
```

#### standards/ Directory (Immutable)
```
standards/
├── documentation.md          # THIS FILE - governance rules
├── coding.md                # Code standards and practices
└── ai-instructions.md       # AI agent behavior rules
```

### PROHIBITED Actions:
- ❌ Creating multiple files for the same topic
- ❌ Creating "planning" documents (use YAML status instead)
- ❌ Creating duplicate architecture files
- ❌ Creating multiple setup guides
- ❌ Creating separate "requirements" documents (use existing structure)
- ❌ Creating changelog files (use git commits)
- ❌ Creating meeting notes (not applicable to personal projects)

---

## Update-First Policy

### Instead of Creating New Documents:

#### For Status Updates:
- **UPDATE**: `docs/status/progress.yaml`
- **DON'T CREATE**: New status files, progress reports, or planning documents

#### For Technical Changes:
- **UPDATE**: `docs/architecture/overview.md`
- **DON'T CREATE**: New architecture files, technical specs, or design documents

#### For UI/UX Changes:
- **UPDATE**: `docs/design-system/components.md`
- **DON'T CREATE**: New design files, style guides, or component documentation

#### For Process Changes:
- **UPDATE**: Existing guide in `docs/guides/`
- **DON'T CREATE**: New process documents or workflow files

---

## Content Organization Rules

### Information Hierarchy:
1. **README.md** - What, why, and where to find more
2. **docs/** - How to implement and current state
3. **standards/** - Rules and governance (this level)

### Content Consolidation Rules:
- **Merge similar topics** into single documents
- **Use sections and subsections** instead of separate files
- **Reference, don't duplicate** information from other sources
- **Keep related information together** in logical groupings

### Length Guidelines:
- **README.md**: Maximum 200 lines (overview only)
- **Individual docs**: Maximum 500 lines (detailed but focused)
- **Standards files**: No length limit (comprehensive rules)

---

## AI Agent Behavior Rules

### Mandatory Checks Before Any Documentation Action:

```yaml
pre_action_checklist:
  document_exists_check: true
  content_duplication_check: true
  hierarchy_validation: true
  necessity_assessment: true
  update_vs_create_decision: true
```

### Content Creation Restrictions:
- **ASK FIRST**: "Should I update an existing document instead?"
- **VERIFY**: Information doesn't exist in current documentation
- **CONSOLIDATE**: Multiple related topics into single documents
- **REFERENCE**: Link to authoritative sources rather than duplicate

### Prohibited AI Behaviors:
- Creating documents without checking existing content
- Duplicating information across multiple files
- Creating planning documents instead of using status files
- Generating comprehensive guides for simple topics
- Creating separate files for related topics

---

## Exception Handling

### When New Documents ARE Allowed:

1. **Completely new project features** not covered anywhere
2. **New major technical domains** (e.g., adding mobile app to web project)
3. **Regulatory requirements** that demand separate documentation
4. **External integration guides** for third-party systems

### Exception Approval Process:
1. **Justify necessity** - Why can't this be added to existing docs?
2. **Identify location** - Where in hierarchy does it belong?
3. **Plan integration** - How will it link to existing content?
4. **Review overlap** - What existing content might be affected?

---

## Enforcement Mechanisms

### Document Creation Review:
- Every new document must reference this standard
- Every new document must justify its existence
- Every new document must link to related existing content

### Regular Audits:
- Monthly review of documentation structure
- Identify and merge duplicate content
- Update this standard as project evolves

### AI Agent Compliance:
- AI must reference this file before creating ANY documentation
- AI must suggest updates to existing documents before creating new ones
- AI must consolidate information rather than fragment it

---

## Violation Consequences

### For Document Violations:
1. **Immediate consolidation** of duplicate content
2. **Deletion of redundant** documents
3. **Update of existing** documents with any new information
4. **Review and revision** of this standard if necessary

### For AI Agent Violations:
1. **Immediate correction** of documentation structure
2. **Re-training emphasis** on these standards
3. **Enhanced checking mechanisms** in future prompts

---

## Quick Reference for AI Agents

### Before Creating ANY Document:
1. ✅ Check if information exists in current docs
2. ✅ Attempt to update existing document instead
3. ✅ Verify necessity and hierarchy placement
4. ✅ Ensure no content duplication
5. ✅ Reference related documents appropriately

### Default Actions:
- **UPDATE** existing documents (preferred)
- **CONSOLIDATE** related information
- **REFERENCE** authoritative sources
- **ASK** before creating new files

### Emergency Override:
Only create new documents if ALL existing documents are inadequate AND the information is critical for project success.

---

## Success Metrics

### Documentation Health Indicators:
- **Single source of truth** for each topic maintained
- **Zero duplicate content** across documents
- **All information easily findable** through hierarchical navigation
- **No orphaned documents** without clear purpose
- **Consistent cross-references** between related topics

This standard ensures lean, efficient, and maintainable documentation that serves the project without becoming a burden.