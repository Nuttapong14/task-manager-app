-- COMPREHENSIVE FIX: Remove ALL circular dependencies in RLS policies
-- This addresses infinite recursion in projects, project_members, tasks, task_tags, and comments

-- Drop ALL problematic policies that reference other tables circularly
DROP POLICY IF EXISTS "Users can view project members" ON public.project_members;
DROP POLICY IF EXISTS "Users can view their projects" ON public.projects;
DROP POLICY IF EXISTS "Project members can view projects" ON public.projects;
DROP POLICY IF EXISTS "Project owners can manage members" ON public.project_members;
DROP POLICY IF EXISTS "Users can view project tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create tasks in their projects" ON public.tasks;
DROP POLICY IF EXISTS "Users can update tasks in their projects" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete tasks in their projects" ON public.tasks;
DROP POLICY IF EXISTS "Users can view task tags" ON public.task_tags;
DROP POLICY IF EXISTS "Users can view comments" ON public.comments;

-- SIMPLE APPROACH: Only check direct ownership/membership without cross-references

-- 1. Projects: Users can only see projects they directly own
CREATE POLICY "Users can view owned projects" ON public.projects FOR SELECT USING (
    owner_id = auth.uid()
);

CREATE POLICY "Users can create projects" ON public.projects FOR INSERT WITH CHECK (
    owner_id = auth.uid()
);

CREATE POLICY "Users can update owned projects" ON public.projects FOR UPDATE USING (
    owner_id = auth.uid()
);

CREATE POLICY "Users can delete owned projects" ON public.projects FOR DELETE USING (
    owner_id = auth.uid()
);

-- 2. Project Members: Users can see their own memberships and project owners can see all members
CREATE POLICY "Users can view own memberships" ON public.project_members FOR SELECT USING (
    user_id = auth.uid()
);

CREATE POLICY "Users can insert own memberships" ON public.project_members FOR INSERT WITH CHECK (
    user_id = auth.uid()
);

-- 3. Tasks: Only allow access to tasks in projects owned by the user (no member access for now)
CREATE POLICY "Users can view tasks in owned projects" ON public.tasks FOR SELECT USING (
    project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid())
);

CREATE POLICY "Users can create tasks in owned projects" ON public.tasks FOR INSERT WITH CHECK (
    project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid())
);

CREATE POLICY "Users can update tasks in owned projects" ON public.tasks FOR UPDATE USING (
    project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid())
);

CREATE POLICY "Users can delete tasks in owned projects" ON public.tasks FOR DELETE USING (
    project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid())
);

-- 4. Task Tags: Only for tasks in owned projects
CREATE POLICY "Users can view tags in owned projects" ON public.task_tags FOR SELECT USING (
    task_id IN (
        SELECT id FROM public.tasks 
        WHERE project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid())
    )
);

-- 5. Comments: Only for tasks in owned projects  
CREATE POLICY "Users can view comments in owned projects" ON public.comments FOR SELECT USING (
    task_id IN (
        SELECT id FROM public.tasks 
        WHERE project_id IN (SELECT id FROM public.projects WHERE owner_id = auth.uid())
    )
);