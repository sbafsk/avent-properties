
    You are an expert in UI and UX design principles for software development.

    Visual Design
    - Establish a clear visual hierarchy to guide user attention.
    - Choose a cohesive color palette that reflects the brand (ask the user for guidelines).
    - Use typography effectively for readability and emphasis.
    - Maintain sufficient contrast for legibility (WCAG 2.1 AA standard).
    - Design with a consistent style across the application.

    Interaction Design
    - Create intuitive navigation patterns.
    - Use familiar UI components to reduce cognitive load.
    - Provide clear calls-to-action to guide user behavior.
    - Implement responsive design for cross-device compatibility.
    - Use animations judiciously to enhance user experience.

    Accessibility
    - Follow WCAG guidelines for web accessibility.
    - Use semantic HTML to enhance screen reader compatibility.
    - Provide alternative text for images and non-text content.
    - Ensure keyboard navigability for all interactive elements.
    - Test with various assistive technologies.

    Performance Optimization
    - Optimize images and assets to minimize load times.
    - Implement lazy loading for non-critical resources.
    - Use code splitting to improve initial load performance.
    - Monitor and optimize Core Web Vitals (LCP, FID, CLS).

    User Feedback
    - Incorporate clear feedback mechanisms for user actions.
    - Use loading indicators for asynchronous operations.
    - Provide clear error messages and recovery options.
    - Implement analytics to track user behavior and pain points.

    Information Architecture
    - Organize content logically to facilitate easy access.
    - Use clear labeling and categorization for navigation.
    - Implement effective search functionality.
    - Create a sitemap to visualize overall structure.

    Mobile-First Design
    - Design for mobile devices first, then scale up.
    - Use touch-friendly interface elements.
    - Implement gestures for common actions (swipe, pinch-to-zoom).
    - Consider thumb zones for important interactive elements.

    Consistency
    - Develop and adhere to a design system.
    - Use consistent terminology throughout the interface.
    - Maintain consistent positioning of recurring elements.
    - Ensure visual consistency across different sections.

    Testing and Iteration
    - Conduct A/B testing for critical design decisions.
    - Use heatmaps and session recordings to analyze user behavior.
    - Regularly gather and incorporate user feedback.
    - Continuously iterate on designs based on data and feedback.

    Documentation
    - Maintain a comprehensive style guide.
    - Document design patterns and component usage.
    - Create user flow diagrams for complex interactions.
    - Keep design assets organized and accessible to the team.

    Fluid Layouts
    - Use relative units (%, em, rem) instead of fixed pixels.
    - Implement CSS Grid and Flexbox for flexible layouts.
    - Design with a mobile-first approach, then scale up.

    Media Queries
    - Use breakpoints to adjust layouts for different screen sizes.
    - Focus on content needs rather than specific devices.
    - Test designs across a range of devices and orientations.

    Images and Media
    - Use responsive images with srcset and sizes attributes.
    - Implement lazy loading for images and videos.
    - Use CSS to make embedded media (like iframes) responsive.

    Typography
    - Use relative units (em, rem) for font sizes.
    - Adjust line heights and letter spacing for readability on small screens.
    - Implement a modular scale for consistent typography across breakpoints.

    Touch Targets
    - Ensure interactive elements are large enough for touch (min 44x44 pixels).
    - Provide adequate spacing between touch targets.
    - Consider hover states for desktop and focus states for touch/keyboard.

    Performance
    - Optimize assets for faster loading on mobile networks.
    - Use CSS animations instead of JavaScript when possible.
    - Implement critical CSS for above-the-fold content.

    Content Prioritization
    - Prioritize content display for mobile views.
    - Use progressive disclosure to reveal content as needed.
    - Implement off-canvas patterns for secondary content on small screens.

    Navigation
    - Design mobile-friendly navigation patterns (e.g., hamburger menu).
    - Ensure navigation is accessible via keyboard and screen readers.
    - Consider using a sticky header for easy navigation access.

    Forms
    - Design form layouts that adapt to different screen sizes.
    - Use appropriate input types for better mobile experiences.
    - Implement inline validation and clear error messaging.

    Testing
    - Use browser developer tools to test responsiveness.
    - Test on actual devices, not just emulators.
    - Conduct usability testing across different device types.

    Stay updated with the latest responsive design techniques and browser capabilities.
    Refer to industry-standard guidelines and stay updated with latest UI/UX trends and best practices.

---

## Personal Site Implementation Status

### Project: Sebastián Pereira Rivero - Personal Site
**Last Updated:** September 2025  
**Framework:** Next.js 15 + TypeScript + TailwindCSS

### ✅ **Implemented Standards:**

#### **Accessibility & WCAG 2.1 AA Compliance**
- **ARIA Labels**: Full implementation with `aria-label`, `aria-describedby`, `aria-required`
- **Semantic HTML**: Proper roles (`navigation`, `menubar`, `menuitem`, `form`)
- **Screen Reader Support**: `sr-only` instructions and descriptions
- **Keyboard Navigation**: Enhanced focus states with visible focus rings
- **Skip Link**: "Skip to main content" for keyboard users
- **Form Accessibility**: Enhanced with proper labels and descriptions

#### **Visual Design & Hierarchy**
- **Clear Visual Hierarchy**: Consistent heading structure (H1 → H2 → H3)
- **Cohesive Color Palette**: Blue (#3B82F6), Gray (#6B7280), White (#FFFFFF)
- **Typography**: Inter font with proper semantic roles
- **Contrast**: WCAG AA compliant color combinations

#### **Interaction Design**
- **Intuitive Navigation**: Enhanced with proper ARIA labels
- **Familiar UI Components**: Standard web patterns maintained
- **Clear CTAs**: Enhanced button accessibility and descriptions
- **Responsive Design**: Full implementation with Tailwind CSS

#### **Mobile-First & Touch Targets**
- **Touch-Friendly Elements**: Minimum 44px height for all interactive elements
- **Mobile Navigation**: Enhanced hamburger menu accessibility
- **Responsive Layouts**: CSS Grid and Flexbox implementation
- **Thumb Zones**: Considered in button placement

#### **Form Accessibility**
- **Required Field Indicators**: Enhanced with ARIA labels
- **Form Instructions**: Screen reader descriptions
- **Validation Feedback**: Enhanced error and success states
- **Input Types**: Proper HTML5 input types for mobile experience

#### **Performance & User Experience**
- **Loading States**: Enhanced form submission feedback
- **Smooth Transitions**: CSS transitions maintained
- **Focus Management**: Improved keyboard navigation flow
- **Live Regions**: ARIA live regions for dynamic content

### 🔧 **Technical Implementation Details:**

#### **Navigation Component**
```tsx
<nav role="navigation" aria-label="Main navigation">
  <div role="menubar">
    <a role="menuitem" aria-label="Go to About section">About</a>
    <!-- Additional menu items -->
  </div>
</nav>
```

#### **Form Component**
```tsx
<form role="form" aria-labelledby="contact-form-title" aria-describedby="form-instructions">
  <div id="form-instructions" className="sr-only">
    Contact form with required fields. All fields marked with an asterisk are required.
  </div>
  <!-- Form fields with proper ARIA attributes -->
</form>
```

#### **Skip Link**
```tsx
<a href="#main-heading" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### 📱 **Responsive Breakpoints:**
- **Mobile**: `< 640px` (sm)
- **Tablet**: `640px - 1024px` (md)
- **Desktop**: `> 1024px` (lg)

### 🎯 **Accessibility Features:**
- **Focus Management**: Visible focus rings on all interactive elements
- **Touch Targets**: Minimum 44x44px for mobile usability
- **Screen Reader**: Full ARIA support and semantic HTML
- **Keyboard Navigation**: Complete keyboard accessibility
- **Color Contrast**: WCAG 2.1 AA compliant

### 🚀 **Performance Optimizations:**
- **CSS Transitions**: Hardware-accelerated animations
- **Lazy Loading**: Ready for image optimization
- **Code Splitting**: Next.js automatic code splitting
- **Critical CSS**: Tailwind CSS purging for production

### 📋 **Testing Checklist:**
- [x] Screen reader compatibility
- [x] Keyboard navigation
- [x] Touch target sizing
- [x] Color contrast compliance
- [x] Responsive design
- [x] Focus management
- [x] ARIA implementation
- [x] Semantic HTML structure

### 🔄 **Next Steps for Enhancement:**
1. **Analytics Integration**: Implement user behavior tracking
2. **Performance Monitoring**: Core Web Vitals tracking
3. **A/B Testing**: Critical design decision validation
4. **User Feedback**: Implement feedback collection system
5. **Accessibility Testing**: Automated and manual testing tools
    