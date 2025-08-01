-- Seed data for TaskFlow application
-- This script populates the database with sample data for development
-- WARNING: This seed data will only work after creating test users via Supabase Auth
-- 
-- To create test users, use the Supabase dashboard or auth API:
-- 1. Go to Authentication > Users in Supabase dashboard
-- 2. Create users with these emails and get their UUIDs
-- 3. Update the UUIDs below to match the actual auth.users IDs
--
-- Alternative: Skip seed data and create users through the application

-- COMMENTED OUT: Insert sample profiles (uncomment and update UUIDs after creating auth users)
-- INSERT INTO public.profiles (id, email, name, avatar_url, role) VALUES
--     ('YOUR_ACTUAL_USER_UUID_1', 'john.doe@example.com', 'John Doe', '/placeholder.svg?height=40&width=40', 'admin'),
--     ('YOUR_ACTUAL_USER_UUID_2', 'alice.johnson@example.com', 'Alice Johnson', '/placeholder.svg?height=40&width=40', 'editor'),
--     ('YOUR_ACTUAL_USER_UUID_3', 'bob.smith@example.com', 'Bob Smith', '/placeholder.svg?height=40&width=40', 'editor'),
--     ('YOUR_ACTUAL_USER_UUID_4', 'carol.davis@example.com', 'Carol Davis', '/placeholder.svg?height=40&width=40', 'editor'),
--     ('YOUR_ACTUAL_USER_UUID_5', 'david.wilson@example.com', 'David Wilson', '/placeholder.svg?height=40&width=40', 'viewer')
-- ON CONFLICT (id) DO NOTHING;

-- COMMENTED OUT: Insert sample projects (uncomment after creating auth users)
-- INSERT INTO public.projects (id, name, description, color, owner_id, due_date) VALUES
--     ('660e8400-e29b-41d4-a716-446655440001', 'Website Redesign', 'Complete overhaul of company website with modern design', 'from-purple-500 to-pink-500', 'YOUR_ACTUAL_USER_UUID_1', '2024-02-15'),
--     ('660e8400-e29b-41d4-a716-446655440002', 'Mobile App', 'Native iOS and Android application development', 'from-blue-500 to-cyan-500', 'YOUR_ACTUAL_USER_UUID_1', '2024-03-01'),
--     ('660e8400-e29b-41d4-a716-446655440003', 'Marketing Campaign', 'Q1 digital marketing strategy and execution', 'from-green-500 to-emerald-500', 'YOUR_ACTUAL_USER_UUID_2', '2024-01-30')
-- ON CONFLICT (id) DO NOTHING;

-- COMMENTED OUT: Insert project members (uncomment after creating auth users and projects)
-- INSERT INTO public.project_members (project_id, user_id, role) VALUES
--     (project_uuid, user_uuid, 'admin')
-- ON CONFLICT (project_id, user_id) DO NOTHING;

-- COMMENTED OUT: Insert sample tasks (uncomment after creating users and projects)
-- All sample data requires actual user UUIDs from auth.users table

-- COMMENTED OUT: Insert task tags (depends on tasks being created first)

-- COMMENTED OUT: Insert sample comments (depends on tasks and users being created first)

-- COMMENTED OUT: Insert sample notifications (depends on users being created first)

-- NOTE: To add seed data after creating users:
-- 1. Create users via Supabase Auth (Dashboard > Authentication > Users)
-- 2. Get their actual UUIDs from auth.users table
-- 3. Uncomment and update the INSERT statements above with real UUIDs
-- 4. Run this migration again or execute the INSERT statements manually