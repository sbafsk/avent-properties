# Development Environment Setup - Avent Properties

> **AI Context**: This is the setup guide for developers.
> For current status: see [../status/progress.yaml](../status/progress.yaml)
> For architecture details: see [../architecture/overview.md](../architecture/overview.md)

## 🚀 **Quick Start**

Get Avent Properties running on your local machine in under 10 minutes.

## 📋 **Prerequisites**

- **Node.js**: 18.17+ (LTS recommended)
- **Yarn**: 1.22+ (preferred package manager)
- **Git**: Latest version
- **Supabase CLI**: For local development (optional)

## 🔧 **Environment Setup**

### **1. Clone Repository**
```bash
git clone <repository-url>
cd avent-properties
```

### **2. Install Dependencies**
```bash
yarn install
```

### **3. Environment Configuration**
Create `.env.local` file in the root directory:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Optional: Development Overrides
NODE_ENV=development
```

### **4. Database Setup**
```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Start local Supabase instance
supabase start

# Apply migrations
supabase db reset
```

## 🏃‍♂️ **Running the Application**

### **Development Mode**
```bash
# Start development server
yarn dev

# Open http://localhost:3000
```

### **Build & Production**
```bash
# Build for production
yarn build

# Start production server
yarn start

# Lint code
yarn lint

# Run tests
yarn test
```

## 🧪 **Testing Setup**

### **Unit Tests**
```bash
# Run all tests
yarn test

# Run specific test file
yarn test __tests__/graphql/enhanced-resolvers.test.ts

# Run tests with coverage
yarn test --coverage

# Watch mode
yarn test --watch
```

### **GraphQL Testing**
```bash
# Test GraphQL endpoints
yarn test __tests__/graphql/

# Test specific resolver
yarn test __tests__/graphql/hybrid-resolver.test.ts
```

## 🗄️ **Database Management**

### **Local Development**
```bash
# Start local Supabase
supabase start

# View local dashboard
supabase status

# Stop local instance
supabase stop
```

### **Schema Changes**
```bash
# Generate new migration
supabase db diff --schema public

# Apply migrations
supabase db push

# Reset database
supabase db reset
```

## 🔐 **Authentication Setup**

### **Supabase Auth Configuration**
1. Go to your Supabase dashboard
2. Navigate to Authentication > Settings
3. Configure email templates
4. Set up OAuth providers (Google, Facebook)

### **Local Testing**
```bash
# Create test user
supabase auth signup --email test@example.com --password password123

# Verify email (in local development)
supabase auth verify --email test@example.com
```

## 🎨 **UI Development**

### **Component Development**
```bash
# Storybook (if configured)
yarn storybook

# Component testing
yarn test components/
```

### **Styling**
- **TailwindCSS**: Utility-first CSS framework
- **Custom Theme**: Gold luxury color palette
- **Glass Morphism**: Premium visual effects
- **Responsive**: Mobile-first design approach

## 📱 **Mobile Development**

### **Responsive Testing**
- **Chrome DevTools**: Device simulation
- **BrowserStack**: Cross-browser testing
- **Lighthouse**: Performance auditing

### **Breakpoints**
```css
/* Mobile First */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large Desktop */ }
```

## 🚀 **Deployment**

### **Vercel Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

### **Environment Variables**
Set these in your Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 🔍 **Debugging**

### **GraphQL Debugging**
```bash
# Enable GraphQL logging
DEBUG=apollo-server:* yarn dev

# View GraphQL playground
http://localhost:3000/api/graphql
```

### **Database Debugging**
```bash
# View Supabase logs
supabase logs

# Database inspection
supabase db inspect
```

### **Performance Monitoring**
- **React DevTools**: Component profiling
- **Network Tab**: API request analysis
- **Performance Tab**: Rendering metrics

## 📚 **Useful Commands**

### **Development**
```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Lint code
yarn test         # Run tests
yarn type-check   # TypeScript type checking
```

### **Database**
```bash
supabase start    # Start local database
supabase stop     # Stop local database
supabase status   # Check status
supabase db reset # Reset database
```

### **Git Workflow**
```bash
git status        # Check repository status
git add .         # Stage all changes
git commit -m ""  # Commit changes
git push          # Push to remote
```

## 🆘 **Troubleshooting**

### **Common Issues**

#### **Port 3000 Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
yarn dev -p 3001
```

#### **Supabase Connection Issues**
```bash
# Check Supabase status
supabase status

# Restart local instance
supabase stop && supabase start
```

#### **TypeScript Errors**
```bash
# Clear TypeScript cache
rm -rf .next
rm -rf node_modules/.cache

# Reinstall dependencies
yarn install
```

#### **Test Failures**
```bash
# Clear Jest cache
yarn test --clearCache

# Run tests with verbose output
yarn test --verbose
```

## 📞 **Getting Help**

### **Resources**
- **Project Documentation**: [docs/index.md](../index.md)
- **Architecture Overview**: [docs/architecture/overview.md](../architecture/overview.md)
- **Current Status**: [docs/status/progress.yaml](../status/progress.yaml)

### **Support Channels**
- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Check this guide and related docs
- **Team Chat**: Internal development discussions

---

> **Next Steps**: [Architecture Overview](../architecture/overview.md) | [Current Status](../status/progress.yaml)
