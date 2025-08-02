# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TaskFlow (package name: "my-v0-project") is a modern, responsive task management application built with Next.js 14, React 18, and TypeScript. It features a Kanban-style project board with glassmorphism design, real-time collaboration via Supabase, and comprehensive UI components based on Radix UI.

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
- `auth-provider.tsx` - Authentication context with Supabase Auth integration
- `task-modal.tsx` - Task creation and editing interface
- `new-project-modal.tsx` - Project creation modal
- `new-task-modal.tsx` - Task creation modal
- `login-form.tsx` - User authentication form
- `theme-provider.tsx` - Dark/light theme management

### Data Layer
- **Supabase Integration**: Full Supabase backend with PostgreSQL database
- **Database Schema**: SQL migrations in `supabase/migrations/` directory
- **API Layer**: Database operations in `lib/api.ts` with organized entity functions
- **Real-time Features**: Supabase real-time subscriptions for live updates
- **Mock Fallback**: Includes mock WebSocket implementation in `lib/socket.ts`

### UI System
- **Design**: Glassmorphism theme with purple-pink gradients and dark mode
- **Components**: Comprehensive Radix UI component library with custom styling
- **Animations**: Framer Motion for smooth transitions
- **Styling**: Tailwind CSS with custom utility classes

### Authentication
- Supabase Auth with email/password authentication
- Role-based access control (admin, editor, viewer) stored in profiles table
- Protected routes and user context throughout the application
- Automatic profile creation on user signup via database triggers

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
- Project supports npm, pnpm, and yarn package managers
- Uses Next.js App Router with API routes in `app/api/`

## File Structure Notes

### Key Directories
- `/app` - Next.js App Router with pages and API routes
- `/components` - React components (business logic)
- `/components/ui` - Reusable UI primitives (Radix UI based)
- `/lib` - Utility libraries and configurations
- `/supabase/migrations` - Database schema migrations
- `/public` - Static assets (images, icons)
- `/scripts` - Database setup and seed scripts (legacy)
- `/hooks` - Custom React hooks
- `/styles` - Global CSS styles

### Important Files
- `lib/supabase.ts` - Supabase client configuration and TypeScript types
- `lib/api.ts` - Database operation functions organized by entity
- `lib/auth.ts` - Authentication helper functions
- `components/auth-provider.tsx` - Authentication context provider
- `components/theme-provider.tsx` - Theme management context
- `app/layout.tsx` - Root application layout
- `app/page.tsx` - Main application entry point

## Technology Stack

### Core Framework
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling

### UI & Components
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **React Hook Form** + **Zod** - Form handling and validation

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication system
  - Real-time subscriptions
  - Row Level Security (RLS)

### Development Tools
- **TypeScript** - Type safety
- **ESLint** - Code linting
- **PostCSS** - CSS processing