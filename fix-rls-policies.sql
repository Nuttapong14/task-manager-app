-- Fix RLS policies to avoid infinite recursion
-- Run this after the main schema has been applied

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view project members" ON public.project_members;
DROP POLICY IF EXISTS "Project owners can manage members" ON public.project_members;
DROP POLICY IF EXISTS "Users can view project tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create tasks in their projects" ON public.tasks;
DROP POLICY IF EXISTS "Users can update tasks in their projects" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete tasks in their projects" ON public.tasks;
DROP POLICY IF EXISTS "Users can view task tags" ON public.task_tags;
DROP POLICY IF EXISTS "Users can view comments" ON public.comments;

-- Create fixed policies without recursion

-- Project members: Simplified policies
CREATE POLICY "Users can view project members" ON public.project_members FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid())
    OR user_id = auth.uid()
);

CREATE POLICY "Project owners can manage members" ON public.project_members FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid())
);

-- Tasks: Simplified policies
CREATE POLICY "Users can view project tasks" ON public.tasks FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid())
    OR assignee_id = auth.uid()
    OR created_by = auth.uid()
);

CREATE POLICY "Users can create tasks in their projects" ON public.tasks FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid())
);

CREATE POLICY "Users can update tasks in their projects" ON public.tasks FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid())
    OR assignee_id = auth.uid()
);

CREATE POLICY "Users can delete tasks in their projects" ON public.tasks FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid())
);

-- Task tags: Simplified policies
CREATE POLICY "Users can view task tags" ON public.task_tags FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.tasks t 
        JOIN public.projects p ON t.project_id = p.id 
        WHERE t.id = task_id AND (p.owner_id = auth.uid() OR t.assignee_id = auth.uid())
    )
);

CREATE POLICY "Users can manage task tags" ON public.task_tags FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.tasks t 
        JOIN public.projects p ON t.project_id = p.id 
        WHERE t.id = task_id AND p.owner_id = auth.uid()
    )
);

-- Comments: Simplified policies
CREATE POLICY "Users can view comments" ON public.comments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.tasks t 
        JOIN public.projects p ON t.project_id = p.id 
        WHERE t.id = task_id AND (p.owner_id = auth.uid() OR t.assignee_id = auth.uid())
    )
);

CREATE POLICY "Users can create comments" ON public.comments FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.tasks t 
        JOIN public.projects p ON t.project_id = p.id 
        WHERE t.id = task_id AND (p.owner_id = auth.uid() OR t.assignee_id = auth.uid())
    )
    AND user_id = auth.uid()
);

CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE USING (
    user_id = auth.uid()
);

CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (
    user_id = auth.uid()
);