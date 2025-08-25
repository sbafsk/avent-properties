RULES.md – Development Standards for Avent Properties

This document defines best practices, conventions, and standards for developing Avent Properties, a modern, luxury real estate platform.
Tech stack: Next.js (App Router), React, TypeScript, GraphQL, Supabase, shadcn/ui, TailwindCSS, Radix UI, Jest, Playwright, yarn.

1. Development Philosophy

Build clean, maintainable, scalable code.

Follow SOLID principles and component-driven development.

Prefer functional + declarative patterns over imperative code.

Emphasize type safety with TypeScript.

Use GraphQL for strongly-typed APIs.

Ensure code is secure, accessible, and internationalized from the start.

2. Code Implementation Guidelines
   Planning

Start with step-by-step planning.

Write pseudocode and define data models (GraphQL + Supabase) before coding.

Document component architecture and data flow.

Always consider edge cases and error scenarios.

Code Style

Indentation: tabs.

Strings: single quotes 'example'.

No semicolons ; (unless required).

Eliminate unused variables.

Spaces:

After keywords (if (x) not if(x))

Before function declaration parentheses

Around infix operators (a + b not a+b)

else on the same line as closing brace.

Always use strict equality (===).

Line length max: 80 chars.

Multiline objects/arrays → use trailing commas.

3. Naming Conventions

PascalCase: Components, Type definitions, Interfaces.

kebab-case: Directories (components/auth-form) & files (user-profile.tsx).

camelCase: Variables, functions, methods, hooks, props.

UPPERCASE: Constants, ENV variables, global configs.

Patterns

Event handlers → handleClick, handleSubmit.

Boolean variables → isLoading, hasError, canSubmit.

Custom hooks → useAuth, useForm.

Use full words (not abbreviations), except: err, req, res, props, ref.

4. React & Next.js Best Practices
   Components

Use functional components with TypeScript interfaces.

Define using function ComponentName() {} (not arrow functions for components).

Extract logic into custom hooks.

Apply React.memo where performance matters.

Clean up useEffect subscriptions/events.

Performance

Use useCallback for memoized functions.

Use useMemo for expensive computations.

Avoid inline functions in JSX.

Use dynamic imports for code splitting.

Always set stable keys in lists (never use index).

Next.js App Router

Use Server Components by default.

"use client" only for event listeners, state, or browser APIs.

Use next/image, next/link, next/script, next/head.

Implement loading states & error boundaries.

Use metadata API for SEO.

5. GraphQL & Supabase

Use GraphQL API layer over Supabase for querying data.

Define schemas with clear types for properties, users, reservations.

Use Apollo Client (or urql) for frontend queries.

Always validate inputs via Zod before DB writes.

Supabase is MVP-only: easily migratable to AWS RDS + Cognito.

6. TypeScript

Enable strict mode.

Use interfaces for props, state, GraphQL types.

Apply generics when needed.

Use utility types (Partial, Pick, Omit) when possible.

Handle undefined/null with type guards.

Prefer interface over type for extendable objects.

7. UI & Styling

Use shadcn/ui for base components.

Use Radix UI primitives for accessibility.

Styling via TailwindCSS (utility-first).

Apply composition patterns → reusable components.

Dark theme default with glassmorphism & gold accents.

Responsive design (mobile-first).

Ensure WCAG accessibility contrast ratios.

8. State Management
   Local

useState for simple local state.

useReducer for complex local state.

useContext for shared state within a tree.

Global

Use Redux Toolkit.

Create feature slices → avoid monolithic state.

Normalize state structures.

Use selectors for access.

9. Forms & Validation

Use React Hook Form + Zod.

Always show user-friendly error messages.

Validate at both UI & API level.

10. Testing

Unit Tests → Jest + React Testing Library.

E2E → Playwright.

Follow Arrange → Act → Assert pattern.

Mock APIs & external services.

Write integration tests for major user flows.

11. Accessibility (a11y)

Semantic HTML always.

ARIA attributes when needed.

Full keyboard navigation.

Logical heading hierarchy.

Accessible error states.

Manage focus order & visibility.

12. Security

Sanitize user input (DOMPurify).

Prevent XSS/CSRF.

JWT Auth via Supabase.

HTTPS enforced in production.

13. Internationalization (i18n)

Use next-i18next.

Support EN + AR (RTL).

Locale detection enabled.

Proper formatting for dates, numbers, currencies.

14. Documentation

Use JSDoc for functions, classes, and hooks.

Document public components and GraphQL schemas.

Use Markdown for developer docs.

Add examples for tricky components.

15. CI/CD & Tooling
    Package Manager

Always use yarn.

No mixing with npm or pnpm.

Linting & Formatting

Use ESLint with:

eslint-config-next for Next.js best practices

eslint-plugin-react, eslint-plugin-react-hooks

@typescript-eslint/eslint-plugin for TS rules

eslint-plugin-testing-library for RTL test rules

Use Prettier integrated with ESLint.

Enforce formatting before commits.

Git Hooks (Husky + lint-staged)

Pre-commit hook:

Run ESLint & Prettier on staged files via lint-staged.

Run type-check (tsc --noEmit).

Run unit tests for changed files only.

Pre-push hook:

Run full test suite (unit + integration).

Git Branching Strategy

Use GitHub Flow:

main: production-ready branch.

dev: integration branch for features.

feature/\*: feature branches.

fix/\*: bugfix branches.

PRs require:

1 reviewer approval

Passing tests & lint

Continuous Integration (GitHub Actions)

Workflow: .github/workflows/ci.yml

Run on every PR + push to dev or main.

Steps:

Install deps with yarn install --frozen-lockfile.

Run ESLint + Prettier check.

Run TypeScript type check.

Run Jest unit tests.

Run Playwright E2E tests (headless).

Build Next.js project (yarn build).

Continuous Deployment

Environments:

Preview → Vercel auto-deploys PRs.

Staging → Supabase staging DB + Next.js staging deploy.

Production → Vercel (frontend) + Supabase (DB/Auth).

Future migration:

AWS (RDS for DB, Cognito for Auth, S3 + CloudFront for static assets, Lambda for serverless).

Deployment is triggered on merge to main.

Quality Gates

Minimum 80% test coverage enforced by Jest config.

Lint errors = fail build.

Type errors = fail build.

16. Monitoring & Observability (optional but recommended)

Use Sentry for error logging.

Use LogRocket or Datadog for session replay.

Use AWS CloudWatch / GCP Monitoring after migration.

✅ With this, your RULES.md now defines not only coding standards but also CI/CD practices → ensuring the project is consistent, maintainable, and production-ready.
