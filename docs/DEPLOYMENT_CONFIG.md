# Deployment Configuration - Avent Properties

**Purpose:** Complete deployment and infrastructure configuration guide for Avent Properties, covering MVP deployment on Vercel and future AWS migration.

---

## 🚀 MVP Deployment (Vercel + Supabase)

### **Current Architecture**
- **Frontend**: Next.js on Vercel
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **API**: GraphQL via Next.js API routes
- **CDN**: Vercel Edge Network
- **Domain**: Custom domain with SSL

### **Environment Setup**

#### **1. Vercel Configuration**

Create `vercel.json` in project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_APP_URL": "@app_url",
    "NEXT_PUBLIC_APP_NAME": "@app_name"
  },
  "functions": {
    "app/api/graphql/route.ts": {
      "maxDuration": 30
    }
  }
}
```

#### **2. Environment Variables**

Set in Vercel dashboard:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database URLs
DATABASE_URL=your_supabase_database_url
DIRECT_URL=your_supabase_direct_url

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=Avent Properties

# Security
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

### **3. Deployment Process**

#### **Automatic Deployment**
1. Connect GitHub repository to Vercel
2. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `yarn build`
   - **Output Directory**: `.next`
   - **Install Command**: `yarn install --frozen-lockfile`

#### **Manual Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### **4. Domain Configuration**

#### **Custom Domain Setup**
1. Add custom domain in Vercel dashboard
2. Configure DNS records:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```
3. Enable SSL certificate (automatic)

#### **Subdomain Configuration**
```
Type: CNAME
Name: www
Value: your-domain.vercel.app
```

---

## 🔄 CI/CD Pipeline

### **GitHub Actions Workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'yarn'
    
    - name: Install dependencies
      run: yarn install --frozen-lockfile
    
    - name: Run linting
      run: yarn lint
    
    - name: Run type checking
      run: yarn type-check
    
    - name: Run tests
      run: yarn test:ci
    
    - name: Run E2E tests
      run: yarn test:e2e
    
    - name: Build application
      run: yarn build
      env:
        NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
        NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

### **Required Secrets**
- `VERCEL_TOKEN`: Vercel deployment token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

---

## 🔐 Security Configuration

### **1. Supabase Security**

#### **Row Level Security (RLS)**
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_reservations ENABLE ROW LEVEL SECURITY;
-- ... other tables
```

#### **API Security**
- Rate limiting on GraphQL endpoint
- CORS configuration
- Input validation with Zod

### **2. Vercel Security**

#### **Security Headers**
Create `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

---

## 📊 Monitoring & Analytics

### **1. Vercel Analytics**
```bash
yarn add @vercel/analytics
```

Add to `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### **2. Error Monitoring**
```bash
yarn add @sentry/nextjs
```

Configure Sentry in `sentry.client.config.ts`:
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})
```

### **3. Performance Monitoring**
- Vercel Speed Insights
- Core Web Vitals tracking
- Database query performance

---

## 🔄 Future AWS Migration

### **Target Architecture**
- **Frontend**: AWS Amplify or CloudFront + S3
- **Backend**: AWS AppSync (GraphQL) + Lambda
- **Database**: Amazon RDS (PostgreSQL)
- **Storage**: S3 + CloudFront
- **Auth**: AWS Cognito
- **CDN**: CloudFront
- **Monitoring**: CloudWatch + X-Ray

### **Migration Strategy**

#### **Phase 1: Database Migration**
1. Set up Amazon RDS PostgreSQL
2. Configure read replicas
3. Data migration from Supabase
4. Update connection strings

#### **Phase 2: API Migration**
1. Deploy GraphQL API to AWS AppSync
2. Set up Lambda resolvers
3. Configure authentication
4. Update frontend API endpoints

#### **Phase 3: Storage Migration**
1. Set up S3 buckets
2. Configure CloudFront distribution
3. Migrate static assets
4. Update image URLs

#### **Phase 4: Frontend Migration**
1. Deploy to AWS Amplify
2. Configure custom domain
3. Set up SSL certificates
4. Update DNS records

### **AWS Infrastructure as Code**

#### **Terraform Configuration**
```hcl
# main.tf
provider "aws" {
  region = "us-east-1"
}

# RDS Database
resource "aws_db_instance" "avent_properties" {
  identifier        = "avent-properties-db"
  engine            = "postgres"
  engine_version    = "14.7"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  
  db_name  = "avent_properties"
  username = "postgres"
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
}

# S3 Bucket for static assets
resource "aws_s3_bucket" "static_assets" {
  bucket = "avent-properties-assets"
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "static_assets" {
  origin {
    domain_name = aws_s3_bucket.static_assets.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.static_assets.id}"
  }
  
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  
  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.static_assets.id}"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }
}
```

---

## 🔍 Health Checks & Monitoring

### **1. Application Health Checks**
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check database connection
    // Check external services
    // Check application status
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 500 }
    )
  }
}
```

### **2. Uptime Monitoring**
- Set up uptime monitoring with UptimeRobot
- Configure alerts for downtime
- Monitor response times

### **3. Performance Monitoring**
- Track Core Web Vitals
- Monitor API response times
- Database query performance

---

## 🚨 Disaster Recovery

### **1. Backup Strategy**
- Daily automated database backups
- Weekly full system backups
- Point-in-time recovery capability

### **2. Recovery Procedures**
- Document recovery procedures
- Test recovery processes
- Maintain recovery runbooks

### **3. Business Continuity**
- Multi-region deployment
- Failover procedures
- Data replication

---

**Last Updated**: [Current Date]
**Next Review**: [Monthly Review Date]
