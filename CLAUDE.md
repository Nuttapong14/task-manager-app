# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TaskFlow is a modern, responsive task management application built with Next.js 14, React 18, and TypeScript. It features a Kanban-style project board with glassmorphism design, real-time collaboration via WebSocket, and comprehensive UI components based on Radix UI.

## Development Commands

- `npm run dev` - Start development server (runs on http://localhost:3000)
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

Note: The project also supports pnpm and yarn as package managers.

## Architecture

### Core Structure
- **App Router**: Uses Next.js app directory structure with API routes in `app/api/`
- **Component Architecture**: Separation between business components (`/components`) and reusable UI primitives (`/components/ui`)
- **State Management**: React Context for authentication (`AuthProvider`) and theme management (`ThemeProvider`)
- **Real-time Features**: Mock WebSocket implementation in `lib/socket.ts` with event-driven architecture

### Key Components
- `dashboard.tsx` - Main dashboard with project overview and statistics
- `project-board.tsx` - Kanban board implementation with task management
- `auth-provider.tsx` - Authentication context with mock user management
- `task-modal.tsx` - Task creation and editing interface

### Data Layer
- **Mock Data**: Currently uses mock data for projects and tasks
- **Database Schema**: SQL setup scripts in `/scripts/` directory define PostgreSQL schema
- **Real-time Events**: Centralized event types in `SOCKET_EVENTS` constant

### UI System
- **Design**: Glassmorphism theme with purple-pink gradients and dark mode
- **Components**: Comprehensive Radix UI component library with custom styling
- **Animations**: Framer Motion for smooth transitions
- **Styling**: Tailwind CSS with custom utility classes

### Authentication
- Mock authentication system with role-based access (admin, editor, viewer)
- Protected routes and user context throughout the application

## Supabase Setup

### Initial Setup
1. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin operations)

2. Run migrations to set up database schema:
   ```bash
   npx supabase db push
   ```

### Database Structure
- **profiles**: User profiles linked to Supabase Auth users
- **projects**: Project entities with ownership and metadata
- **project_members**: Many-to-many relationship for project collaboration
- **tasks**: Task management with status, priority, and assignment
- **task_tags**: Tag system for task organization
- **comments**: Task discussion system
- **notifications**: User notification system
- **activity_logs**: Audit trail for project activities

### Authentication
- Uses Supabase Auth with email/password
- Row Level Security (RLS) policies enforce data access control
- Automatic profile creation on user signup via database trigger

### API Layer
- `lib/supabase.ts`: Supabase client configuration and TypeScript types
- `lib/api.ts`: Database operation functions organized by entity
- Real-time updates available via Supabase subscriptions

## Development Notes

- TypeScript and ESLint errors are ignored during builds (see next.config.mjs)
- Images are unoptimized for deployment flexibility
- Database migrations are in `supabase/migrations/` directory
- Row Level Security policies ensure data privacy and security