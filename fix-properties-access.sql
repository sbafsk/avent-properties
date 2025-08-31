-- Quick fix for 403 Forbidden error on properties table
-- Run this in your Supabase SQL Editor

-- 1. Ensure RLS is enabled on properties table
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view available properties" ON properties;
DROP POLICY IF EXISTS "Anyone can view all properties for public browsing" ON properties;

-- 3. Create policy to allow public access to properties
CREATE POLICY "Public can view all properties" ON properties
  FOR SELECT USING (true);

-- 4. Grant permissions to anonymous users
GRANT SELECT ON properties TO anon;
GRANT SELECT ON properties TO authenticated;

-- 5. Verify the policy was created
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
