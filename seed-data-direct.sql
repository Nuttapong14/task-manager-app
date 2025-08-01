-- Direct SQL seed data script
-- Run this in Supabase Dashboard > SQL Editor after applying the main schema

-- First, let's create a test user directly (bypasses RLS)
-- This creates both auth user and profile in one transaction
DO $$
DECLARE
    user_id uuid;
    user_email text := 'admin@taskflow.com';
    user_name text := 'Admin User';
BEGIN
    -- Generate a UUID for the user
    user_id := gen_random_uuid();
    
    -- Insert into auth.users (this requires service role or admin access)
    -- Note: In production, users should be created via Supabase Auth signup
    
    -- Insert into profiles (this will work if RLS allows it)
    INSERT INTO public.profiles (id, email, name, role) 
    VALUES (user_id, user_email, user_name, 'admin')
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Created user: % with ID: %', user_name, user_id;
    
    -- Store the user_id for use in the rest of the script
    -- (For this demo, we'll use the generated UUID in subsequent inserts)
    
    -- Insert sample projects
    WITH project_data AS (
        INSERT INTO public.projects (id, name, description, color, owner_id, due_date) VALUES
            (gen_random_uuid(), 'Website Redesign', 
             'Complete overhaul of company website with modern design', 
             'from-purple-500 to-pink-500', user_id, '2025-02-15'),
            (gen_random_uuid(), 'Mobile App Development', 
             'Native iOS and Android application development', 
             'from-blue-500 to-cyan-500', user_id, '2025-03-01'),
            (gen_random_uuid(), 'Marketing Campaign', 
             'Q1 digital marketing strategy and execution', 
             'from-green-500 to-emerald-500', user_id, '2025-01-30')
        RETURNING id, name
    )
    SELECT array_agg(id) FROM project_data;
    
    RAISE NOTICE 'Created projects for user: %', user_id;
    
END $$;

-- Alternative approach: Create sample data structure without specific user references
-- This creates projects and tasks that can be claimed by real users later

-- Sample projects (these will need real owner_ids from actual users)
-- Uncomment and update with real user UUIDs after creating users via Supabase Auth

/*
INSERT INTO public.projects (name, description, color, owner_id, due_date) VALUES
    ('Demo Project 1', 'A sample project for demonstration', 'from-purple-500 to-pink-500', 'YOUR_USER_UUID_HERE', '2025-02-15'),
    ('Demo Project 2', 'Another sample project', 'from-blue-500 to-cyan-500', 'YOUR_USER_UUID_HERE', '2025-03-01')
ON CONFLICT DO NOTHING;
*/

-- Instructions for manual seeding:
-- 1. First create users via Supabase Dashboard > Authentication > Users
-- 2. Copy their UUIDs 
-- 3. Uncomment the INSERT statements above and replace 'YOUR_USER_UUID_HERE' with actual UUIDs
-- 4. Run this script again

-- Check current profiles
SELECT 'Current profiles:' as info;
SELECT id, email, name, role, created_at FROM public.profiles ORDER BY created_at;

-- Check current projects  
SELECT 'Current projects:' as info;
SELECT id, name, description, owner_id, created_at FROM public.projects ORDER BY created_at;