# TaskFlow

A modern, responsive task management application built with Next.js 14, React 18, and TypeScript. TaskFlow features a beautiful Kanban-style project board with glassmorphism design, real-time collaboration capabilities, and comprehensive project management tools.

## ✨ Features

- **Modern UI**: Beautiful glassmorphism design with purple-pink gradients and dark mode support
- **Kanban Board**: Drag-and-drop task management with customizable columns
- **Real-time Collaboration**: Live updates across multiple users (via Supabase)
- **Project Management**: Create, organize, and track multiple projects
- **Task System**: Comprehensive task creation with priorities, due dates, and assignments
- **Authentication**: Secure user authentication with Supabase Auth
- **Responsive Design**: Fully responsive interface that works on all devices
- **Rich Components**: Built with Radix UI components for accessibility and consistency

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, pnpm, or yarn
- Supabase account (for database and authentication)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nuttapong/task-manager-app.git
   cd task-manager-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your Supabase credentials in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. Set up the database:
   ```bash
   npx supabase db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication & authorization
  - Row Level Security (RLS)

### UI Components
- **Radix UI** - Accessible, unstyled components
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form management
- **Zod** - Schema validation

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── auth-provider.tsx # Authentication context
│   ├── dashboard.tsx     # Main dashboard
│   ├── project-board.tsx # Kanban board
│   └── ...
├── lib/                  # Utility libraries
│   ├── api.ts           # Database operations
│   ├── auth.ts          # Authentication helpers
│   ├── supabase.ts      # Supabase client & types
│   └── utils.ts         # General utilities
├── supabase/            # Database migrations
│   └── migrations/      # SQL migration files
└── public/             # Static assets
```

## 🗄️ Database Schema

The application uses the following main tables:

- **profiles** - User profiles linked to Supabase Auth
- **projects** - Project entities with ownership and metadata
- **project_members** - Many-to-many relationship for project collaboration
- **tasks** - Task management with status, priority, and assignment
- **task_tags** - Tag system for task organization
- **comments** - Task discussion system
- **notifications** - User notification system
- **activity_logs** - Audit trail for project activities

## 🔐 Authentication & Security

- Supabase Auth with email/password authentication
- Row Level Security (RLS) policies for data privacy
- Role-based access control (admin, editor, viewer)
- Automatic profile creation on user signup

## 🎨 Design System

- **Theme**: Glassmorphism with purple-pink gradients
- **Dark Mode**: Full dark mode support
- **Responsive**: Mobile-first responsive design
- **Accessibility**: Built with accessibility in mind using Radix UI

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Demo

Visit the live demo: [TaskFlow App](https://task-manager-app-demo.vercel.app) *(Update with your actual deployment URL)*

## 📊 Screenshots

![TaskFlow Dashboard](./public/screenshot-dashboard.png)
![Kanban Board](./public/screenshot-kanban.png)

*Add screenshots to showcase your application*

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Framer Motion](https://www.framer.com/motion/) for smooth animations