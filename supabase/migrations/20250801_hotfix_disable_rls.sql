-- HOTFIX: Temporarily disable RLS to stop infinite recursion
-- This allows the app to work while we fix the policy issues

-- First, drop all problematic policies
DROP POLICY IF EXISTS "Users can view their projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view project members" ON public.project_members;
DROP POLICY IF EXISTS "Project owners can manage members" ON public.project_members;

-- Temporarily disable RLS on projects table
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;

-- Keep RLS enabled on other tables but with simple policies
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Simple policy for project_members (no cross-references)
CREATE POLICY "Allow all project member operations" ON public.project_members FOR ALL USING (true);

-- Re-enable basic policies for projects (owner-only access)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own projects" ON public.projects FOR ALL USING (
    owner_id = auth.uid()
);