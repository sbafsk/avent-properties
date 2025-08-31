-- Avent Properties - Row Level Security Setup
-- Run this in your Supabase SQL Editor to fix 403 Forbidden errors

-- 1. Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view available properties" ON properties;
DROP POLICY IF EXISTS "Agency can manage their properties" ON properties;
DROP POLICY IF EXISTS "Admins can manage all properties" ON properties;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Users can view their own reservations" ON tour_reservations;
DROP POLICY IF EXISTS "Users can create reservations" ON tour_reservations;
DROP POLICY IF EXISTS "Users can update their own reservations" ON tour_reservations;
DROP POLICY IF EXISTS "Anyone can create contact requests" ON contact_requests;
DROP POLICY IF EXISTS "Users can view their own contact requests" ON contact_requests;
DROP POLICY IF EXISTS "Admins can view all contact requests" ON contact_requests;

-- 3. Create RLS Policies

-- Properties table policies (MOST IMPORTANT - fixes the 403 error)
CREATE POLICY "Anyone can view available properties" ON properties
  FOR SELECT USING (status = 'AVAILABLE');

CREATE POLICY "Anyone can view all properties for public browsing" ON properties
  FOR SELECT USING (true);

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

-- Agencies policies
CREATE POLICY "Anyone can view agencies" ON agencies
  FOR SELECT USING (true);

CREATE POLICY "Agency can manage their own agency" ON agencies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'AGENCY'
    ) AND id = auth.uid()
  );

-- 4. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 5. Set default privileges for future tables
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public 
GRANT ALL ON TABLES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public 
GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- 6. Verify the setup
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'agencies', 'properties', 'tour_reservations', 'transactions', 'contact_requests', 'audit_logs');

-- 7. Check policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'properties';
