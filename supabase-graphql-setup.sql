-- Avent Properties - GraphQL Setup
-- Run this in your Supabase SQL Editor

-- 1. Check if pg_graphql extension is enabled
SELECT * FROM pg_extension WHERE extname = 'pg_graphql';

-- 2. Enable pg_graphql if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_graphql;

-- 3. Grant permissions to expose tables in GraphQL API
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 4. Set default privileges for future tables
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public 
GRANT ALL ON TABLES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public 
GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- 5. Verify our tables exist and are accessible
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- 6. Check table permissions
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public';
