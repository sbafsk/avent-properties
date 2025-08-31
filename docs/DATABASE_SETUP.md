# Database Setup - Avent Properties

**Purpose:** Complete guide for setting up and configuring the database for Avent Properties using Prisma with Supabase PostgreSQL.

---

## 🗄️ Database Architecture

### **Technology Stack**
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma Client
- **Migration Tool**: Prisma Migrate
- **Connection**: Connection pooling via Supabase

### **Core Tables**
1. **users** - User accounts with role-based access
2. **agencies** - Real estate agencies
3. **properties** - Property listings with details
4. **tour_reservations** - Tour bookings with deposit tracking
5. **transactions** - Financial transactions and commissions
6. **contact_requests** - Customer inquiries
7. **audit_logs** - System audit trail

---

## 🔧 Initial Setup

### **1. Environment Configuration**

Create `.env.local` with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database URLs (Supabase)
DATABASE_URL="postgresql://postgres.waiuluclvrdfkjnelssg:Qw&FfmFQNRch4j%@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.waiuluclvrdfkjnelssg:Qw&FfmFQNRch4j%@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Avent Properties
```

### **2. Install Prisma Dependencies**

```bash
yarn add prisma @prisma/client
yarn add -D prisma
```

### **3. Initialize Prisma**

```bash
npx prisma init
```

---

## 📋 Prisma Schema

### **Complete Schema Definition**

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// User Management
model User {
  id         String   @id @default(cuid())
  email      String   @unique
  name       String
  role       UserRole @default(CLIENT)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  // Relations
  reservations TourReservation[]
  transactions Transaction[]
  contact_requests ContactRequest[]

  @@map("users")
}

enum UserRole {
  ADMIN
  CLIENT
  AGENCY
}

// Agency Management
model Agency {
  id         String   @id @default(cuid())
  name       String
  email      String   @unique
  phone      String?
  address    String?
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  // Relations
  properties Property[]

  @@map("agencies")
}

// Property Listings
model Property {
  id             String         @id @default(cuid())
  title          String
  description    String
  price          Float
  currency       String         @default("USD")
  city           String
  neighborhood   String?
  property_type  String
  bedrooms       Int?
  bathrooms      Int?
  area_m2        Int?
  amenities      String[]       @default([])
  images         String[]       @default([])
  status         PropertyStatus @default(AVAILABLE)
  agency_id      String
  created_at     DateTime       @default(now())
  updated_at     DateTime       @updatedAt

  // Relations
  agency       Agency            @relation(fields: [agency_id], references: [id], onDelete: Cascade)
  reservations TourReservation[]

  @@map("properties")
}

enum PropertyStatus {
  AVAILABLE
  RESERVED
  SOLD
}

// Tour Reservations
model TourReservation {
  id              String            @id @default(cuid())
  user_id         String
  property_id     String
  scheduled_date  DateTime
  deposit_amount  Float
  status          ReservationStatus @default(PENDING)
  created_at      DateTime          @default(now())
  updated_at      DateTime          @updatedAt

  // Relations
  user      User      @relation(fields: [user_id], references: [id], onDelete: Cascade)
  property  Property  @relation(fields: [property_id], references: [id], onDelete: Cascade)
  transactions Transaction[]

  @@map("tour_reservations")
}

enum ReservationStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

// Financial Transactions
model Transaction {
  id             String          @id @default(cuid())
  amount         Float
  type           TransactionType
  status         TransactionStatus @default(PENDING)
  reservation_id String?
  user_id        String
  created_at     DateTime        @default(now())
  updated_at     DateTime        @updatedAt

  // Relations
  user        User            @relation(fields: [user_id], references: [id], onDelete: Cascade)
  reservation TourReservation? @relation(fields: [reservation_id], references: [id], onDelete: SetNull)

  @@map("transactions")
}

enum TransactionType {
  DEPOSIT
  COMMISSION
  REFUND
}

enum TransactionStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

// Contact Requests
model ContactRequest {
  id         String        @id @default(cuid())
  name       String
  email      String
  phone      String?
  message    String
  property_id String?
  status     ContactStatus @default(NEW)
  created_at DateTime      @default(now())
  updated_at DateTime      @updatedAt

  // Relations
  user      User?     @relation(fields: [user_id], references: [id], onDelete: SetNull)
  user_id   String?

  @@map("contact_requests")
}

enum ContactStatus {
  NEW
  IN_PROGRESS
  RESOLVED
  CLOSED
}

// Audit Logs
model AuditLog {
  id          String   @id @default(cuid())
  user_id     String?
  action      String
  table_name  String
  record_id   String?
  old_values  Json?
  new_values  Json?
  ip_address  String?
  user_agent  String?
  created_at  DateTime @default(now())

  @@map("audit_logs")
}
```

---

## 🚀 Database Migration

### **1. Generate Migration**

```bash
npx prisma migrate dev --name init
```

### **2. Apply Migration to Production**

```bash
npx prisma migrate deploy
```

### **3. Generate Prisma Client**

```bash
npx prisma generate
```

---

## 🔐 Row Level Security (RLS)

### **Enable RLS on All Tables**

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
```

### **RLS Policies**

```sql
-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Properties table policies
CREATE POLICY "Anyone can view available properties" ON properties
  FOR SELECT USING (status = 'AVAILABLE');

CREATE POLICY "Agency can manage their properties" ON properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'AGENCY'
    ) AND agency_id = auth.uid()
  );

CREATE POLICY "Admins can manage all properties" ON properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Tour Reservations policies
CREATE POLICY "Users can view their own reservations" ON tour_reservations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create reservations" ON tour_reservations
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reservations" ON tour_reservations
  FOR UPDATE USING (user_id = auth.uid());

-- Contact Requests policies
CREATE POLICY "Anyone can create contact requests" ON contact_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own contact requests" ON contact_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all contact requests" ON contact_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );
```

---

## 🌱 Database Seeding

### **1. Create Seed Script**

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create agencies
  const agency1 = await prisma.agency.create({
    data: {
      name: 'Luxury Estates Uruguay',
      email: 'info@luxuryestates.uy',
      phone: '+598 99 123 456',
      address: 'Ruta Interbalnearia Km 37, Punta del Este',
    },
  })

  const agency2 = await prisma.agency.create({
    data: {
      name: 'Coastal Properties José Ignacio',
      email: 'contact@coastalji.com',
      phone: '+598 99 789 012',
      address: 'Ruta 10 Km 180, José Ignacio',
    },
  })

  // Create properties
  const properties = [
    {
      title: 'Oceanfront Villa Punta del Este',
      description: 'Stunning 5-bedroom villa with panoramic ocean views, private beach access, and infinity pool.',
      price: 2500000,
      currency: 'USD',
      city: 'Punta del Este',
      neighborhood: 'La Barra',
      property_type: 'Villa',
      bedrooms: 5,
      bathrooms: 4,
      area_m2: 450,
      amenities: ['Pool', 'Beach Access', 'Garden', 'Security System', 'Wine Cellar'],
      images: ['/properties/villa-punta-1.jpg', '/properties/villa-punta-2.jpg'],
      status: 'AVAILABLE',
      agency_id: agency1.id,
    },
    // ... 18 more properties
  ]

  for (const property of properties) {
    await prisma.property.create({ data: property })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### **2. Run Seed**

```bash
npx prisma db seed
```

---

## 🔍 Database Management

### **Useful Commands**

```bash
# View database in browser
npx prisma studio

# Reset database (development only)
npx prisma migrate reset

# Check database status
npx prisma migrate status

# Generate client after schema changes
npx prisma generate

# Push schema changes (development)
npx prisma db push
```

### **Backup and Restore**

```bash
# Create backup
pg_dump $DATABASE_URL > backup.sql

# Restore from backup
psql $DATABASE_URL < backup.sql
```

---

## 🚨 Security Considerations

### **Connection Security**
- Use connection pooling for production
- Implement connection limits
- Monitor connection usage

### **Data Protection**
- Encrypt sensitive data at rest
- Implement proper access controls
- Regular security audits

### **Backup Strategy**
- Daily automated backups
- Point-in-time recovery
- Test restore procedures

---

## 📊 Monitoring and Performance

### **Key Metrics to Monitor**
- Query performance
- Connection pool usage
- Storage growth
- Backup success rates

### **Performance Optimization**
- Index optimization
- Query optimization
- Connection pooling
- Caching strategies

---

**Last Updated**: [Current Date]
**Next Review**: [Monthly Review Date]
