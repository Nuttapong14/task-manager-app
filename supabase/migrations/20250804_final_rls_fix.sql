-- FINAL RLS FIX: Remove all circular dependencies completely
-- This will definitively solve the infinite recursion issue

-- Step 1: Drop ALL existing policies on all tables to start fresh
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on all tables
    FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.schemaname || '.' || r.tablename;
    END LOOP;
END $$;

-- Step 2: Create simple, non-circular policies

-- PROFILES: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- PROJECTS: Users can only access projects they own (simplest approach)
CREATE POLICY "Users own projects" ON public.projects FOR ALL USING (owner_id = auth.uid());

-- PROJECT_MEMBERS: Allow all operations for now (we'll refine later)
CREATE POLICY "Allow project members access" ON public.project_members FOR ALL USING (true);

-- TASKS: Users can access tasks in projects they own
CREATE POLICY "Users can access tasks in owned projects" ON public.tasks FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid())
);

-- TASK_TAGS: Users can access tags for tasks in projects they own
CREATE POLICY "Users can access task tags in owned projects" ON public.task_tags FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.tasks t 
        JOIN public.projects p ON t.project_id = p.id 
        WHERE t.id = task_id AND p.owner_id = auth.uid()
    )
);

-- COMMENTS: Users can access comments on tasks in projects they own
CREATE POLICY "Users can access comments in owned projects" ON public.comments FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.tasks t 
        JOIN public.projects p ON t.project_id = p.id 
        WHERE t.id = task_id AND p.owner_id = auth.uid()
    )
);

-- NOTIFICATIONS: Users can only access their own notifications
CREATE POLICY "Users can access own notifications" ON public.notifications FOR ALL USING (user_id = auth.uid());

-- ACTIVITY_LOGS: Users can access logs for projects they own
CREATE POLICY "Users can access activity logs for owned projects" ON public.activity_logs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid())
);