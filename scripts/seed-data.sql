-- Seed data for TaskFlow application
-- This script populates the database with sample data for development

-- Insert sample users
INSERT INTO users (id, email, name, avatar_url, role) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', 'John Doe', '/placeholder.svg?height=40&width=40', 'admin'),
    ('550e8400-e29b-41d4-a716-446655440002', 'alice.johnson@example.com', 'Alice Johnson', '/placeholder.svg?height=40&width=40', 'editor'),
    ('550e8400-e29b-41d4-a716-446655440003', 'bob.smith@example.com', 'Bob Smith', '/placeholder.svg?height=40&width=40', 'editor'),
    ('550e8400-e29b-41d4-a716-446655440004', 'carol.davis@example.com', 'Carol Davis', '/placeholder.svg?height=40&width=40', 'editor'),
    ('550e8400-e29b-41d4-a716-446655440005', 'david.wilson@example.com', 'David Wilson', '/placeholder.svg?height=40&width=40', 'viewer')
ON CONFLICT (id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, name, description, color, owner_id, due_date) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'Website Redesign', 'Complete overhaul of company website with modern design', 'from-purple-500 to-pink-500', '550e8400-e29b-41d4-a716-446655440001', '2024-02-15'),
    ('660e8400-e29b-41d4-a716-446655440002', 'Mobile App', 'Native iOS and Android application development', 'from-blue-500 to-cyan-500', '550e8400-e29b-41d4-a716-446655440001', '2024-03-01'),
    ('660e8400-e29b-41d4-a716-446655440003', 'Marketing Campaign', 'Q1 digital marketing strategy and execution', 'from-green-500 to-emerald-500', '550e8400-e29b-41d4-a716-446655440002', '2024-01-30')
ON CONFLICT (id) DO NOTHING;

-- Insert project members
INSERT INTO project_members (project_id, user_id, role) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'admin'),
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'editor'),
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'editor'),
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'editor'),
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 'viewer'),
    
    ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'admin'),
    ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'editor'),
    ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'editor'),
    
    ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'admin'),
    ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'editor'),
    ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'editor'),
    ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 'viewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (id, title, description, status, priority, project_id, assignee_id, created_by, due_date) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'Design Homepage Layout', 'Create wireframes and mockups for the new homepage design', 'in-progress', 'high', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '2024-01-25'),
    ('770e8400-e29b-41d4-a716-446655440002', 'Set up Authentication', 'Implement user login and registration system', 'todo', 'medium', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '2024-01-28'),
    ('770e8400-e29b-41d4-a716-446655440003', 'Database Schema', 'Design and implement the database structure', 'done', 'high', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '2024-01-20'),
    ('770e8400-e29b-41d4-a716-446655440004', 'Mobile Responsive Design', 'Ensure the website works perfectly on mobile devices', 'todo', 'medium', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', '2024-02-01'),
    
    ('770e8400-e29b-41d4-a716-446655440005', 'iOS App Development', 'Build native iOS application', 'in-progress', 'high', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '2024-02-20'),
    ('770e8400-e29b-41d4-a716-446655440006', 'Android App Development', 'Build native Android application', 'todo', 'high', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '2024-02-25'),
    
    ('770e8400-e29b-41d4-a716-446655440007', 'Social Media Strategy', 'Develop comprehensive social media marketing plan', 'done', 'medium', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '2024-01-15'),
    ('770e8400-e29b-41d4-a716-446655440008', 'Content Creation', 'Create marketing content for Q1 campaign', 'in-progress', 'medium', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '2024-01-28')
ON CONFLICT (id) DO NOTHING;

-- Insert task tags
INSERT INTO task_tags (task_id, tag) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'design'),
    ('770e8400-e29b-41d4-a716-446655440001', 'ui/ux'),
    ('770e8400-e29b-41d4-a716-446655440002', 'backend'),
    ('770e8400-e29b-41d4-a716-446655440002', 'auth'),
    ('770e8400-e29b-41d4-a716-446655440003', 'database'),
    ('770e8400-e29b-41d4-a716-446655440003', 'backend'),
    ('770e8400-e29b-41d4-a716-446655440004', 'frontend'),
    ('770e8400-e29b-41d4-a716-446655440004', 'responsive'),
    ('770e8400-e29b-41d4-a716-446655440005', 'mobile'),
    ('770e8400-e29b-41d4-a716-446655440005', 'ios'),
    ('770e8400-e29b-41d4-a716-446655440006', 'mobile'),
    ('770e8400-e29b-41d4-a716-446655440006', 'android'),
    ('770e8400-e29b-41d4-a716-446655440007', 'marketing'),
    ('770e8400-e29b-41d4-a716-446655440007', 'strategy'),
    ('770e8400-e29b-41d4-a716-446655440008', 'marketing'),
    ('770e8400-e29b-41d4-a716-446655440008', 'content')
ON CONFLICT (task_id, tag) DO NOTHING;

-- Insert sample comments
INSERT INTO comments (task_id, user_id, content) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Great progress on the wireframes! The layout looks clean and modern.'),
    ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Thanks! I''ve incorporated the feedback from the design review.'),
    ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Should we consider adding a dark mode toggle to the header?'),
    
    ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'I''ll start working on this once the database schema is finalized.'),
    
    ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'Database schema is complete and ready for review.'),
    ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Excellent work! The schema looks comprehensive.'),
    ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'Added indexes for better query performance.'),
    ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Perfect! This will work great with the authentication system.'),
    ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Ready to proceed with the backend implementation.')
ON CONFLICT DO NOTHING;

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, data) VALUES
    ('550e8400-e29b-41d4-a716-446655440002', 'task_assigned', 'New Task Assigned', 'You have been assigned to "Design Homepage Layout"', '{"task_id": "770e8400-e29b-41d4-a716-446655440001", "project_id": "660e8400-e29b-41d4-a716-446655440001"}'),
    ('550e8400-e29b-41d4-a716-446655440003', 'task_assigned', 'New Task Assigned', 'You have been assigned to "Set up Authentication"', '{"task_id": "770e8400-e29b-41d4-a716-446655440002", "project_id": "660e8400-e29b-41d4-a716-446655440001"}'),
    ('550e8400-e29b-41d4-a716-446655440001', 'task_completed', 'Task Completed', 'Carol Davis completed "Database Schema"', '{"task_id": "770e8400-e29b-41d4-a716-446655440003", "project_id": "660e8400-e29b-41d4-a716-446655440001"}'),
    ('550e8400-e29b-41d4-a716-446655440002', 'project_invite', 'Project Invitation', 'You have been invited to join "Marketing Campaign"', '{"project_id": "660e8400-e29b-41d4-a716-446655440003"}')
ON CONFLICT DO NOTHING;
