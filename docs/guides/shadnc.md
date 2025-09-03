📘 AI Training Guide – Implementing shadcn/ui with MCP
🎯 Purpose

Train an AI assistant (Claude, Cursor, Copilot, ChatGPT, etc.) to:

Browse, search, and install shadcn components via MCP.

Apply UI/UX principles (based on your spec file).

Ensure accessibility and performance optimization.

Generate complete UI flows (landing pages, dashboards, forms) using natural language prompts.

🛠️ 1. Setting Up the MCP Server
Initialize MCP in your project
npx shadcn@latest mcp init --client cursor

Configure registries (components.json)
{
  "registries": {
    "shadcn": "https://ui.shadcn.com/r/{name}.json",
    "@internal": "https://internal.company.com/{name}.json"
  }
}


Enable in your chosen client (Cursor, VS Code, Claude).
Once connected, the assistant can respond to prompts like:

“Show me all available components in the shadcn registry”

“Add the button, dialog, and card components to my project”

“Create a responsive login form using shadcn components”

🎨 2. Embedding UI/UX Principles into AI Prompts

The assistant should always consider the UI spec file when suggesting or generating components:

Visual Design

Maintain clear visual hierarchy (headings, typography scale).

Apply a cohesive color palette (ask user for brand colors).

Ensure contrast meets WCAG 2.1 AA.

Enforce consistency across pages.

Interaction Design

Suggest familiar patterns (cards, modals, buttons from shadcn).

Provide clear CTAs with Button or Callout components.

Always design responsive-first layouts with Flex and Grid.

Add subtle animations using Framer Motion (for feedback, not decoration).

Accessibility

Use semantic HTML (<header>, <main>, <nav>).

Add ARIA roles/labels where necessary.

Ensure keyboard navigation for dialogs, dropdowns, modals.

Provide alt text for images.

Performance

Enforce lazy loading on images/components.

Use code splitting in Next.js.

Monitor Core Web Vitals (LCP, FID, CLS).

⚡ 3. Example AI Prompts for shadcn MCP
Browse & Search

“List all form components in the shadcn registry.”

“Find me a multi-step form component.”

Install

“Add the card, badge, and dialog components to my project.”

“Install the navbar component and set it up for dark mode.”

Build Full Features

“Create a responsive landing page with a hero, features section, and testimonials using shadcn components.”

“Generate a tour booking form with validation and error states using shadcn forms, inputs, and modals.”

Accessibility Enhancements

“Wrap the login form with semantic <form> and add ARIA labels for screen readers.”

“Ensure all buttons meet 44x44px minimum touch target size.”

🔍 4. Validation & Testing Workflow

Train the AI to also suggest:

A/B testing with design variants.

Heatmaps and analytics integration for behavior tracking.

Unit and accessibility tests with Playwright or Jest + Axe.

CI/CD validation for component updates (avoiding regressions).

📈 5. Best Practices for AI + shadcn Workflows

Always cross-check generated code with your design system.

Prefer shadcn defaults over custom code (to maintain consistency).

Embed accessibility rules in AI prompts (never optional).

Iterate via user feedback loops (the assistant can suggest survey or analytics hooks).

Document generated components in your design system automatically.

✅ With this guide, you can “train” your AI assistant to not just install components, but also enforce good design, accessibility, and performance practices while working with shadcn MCP.