# TaskFlow - Task Manager Application
### ***(This is a Vibe Coding From V0)***

A modern, responsive task management application built with Next.js, React, and TypeScript. TaskFlow provides an intuitive interface for managing projects and tasks with a beautiful glassmorphism design and smooth animations.

## ✨ Features

- **Project Management**: Create and organize multiple projects with custom colors and descriptions
- **Kanban Board**: Visual task management with drag-and-drop functionality (To Do, In Progress, Done)
- **User Authentication**: Secure login system with user profiles
- **Real-time Updates**: Live updates using WebSocket connections
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Theme**: Modern glassmorphism UI with dark theme
- **Task Prioritization**: Set task priorities (Low, Medium, High) with color coding
- **Team Collaboration**: Add team members to projects and assign tasks
- **Dashboard Analytics**: Overview of projects, active tasks, and team statistics

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with custom glassmorphism effects
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React hooks and context
- **Real-time**: WebSocket API routes

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up the database** (if applicable)
   ```bash
   # Run the database setup script
   # Make sure to configure your database connection first
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
task-manager-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── socket/        # WebSocket API
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components (Radix UI)
│   ├── auth-provider.tsx # Authentication context
│   ├── dashboard.tsx     # Main dashboard component
│   ├── project-board.tsx # Kanban board component
│   ├── task-modal.tsx    # Task details modal
│   └── ...
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/              # Static assets
├── scripts/             # Database scripts
└── styles/              # Additional styles
```

## 🎨 UI Components

The application uses a comprehensive set of UI components built on top of Radix UI:

- **Layout**: Cards, Separators, Resizable panels
- **Navigation**: Breadcrumbs, Navigation menu, Sidebar
- **Forms**: Input, Textarea, Select, Checkbox, Radio groups
- **Feedback**: Toast notifications, Alert dialogs, Progress bars
- **Data Display**: Tables, Badges, Avatars, Charts
- **Overlays**: Modals, Popovers, Tooltips, Dropdowns

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Key Features Breakdown

### Dashboard
- Project overview with statistics
- Quick access to recent projects
- Team member count and active tasks
- Search functionality for projects

### Project Board
- Kanban-style task management
- Three columns: To Do, In Progress, Done
- Task cards with priority indicators
- Assignee avatars and due dates
- Comment counts and tags

### Task Management
- Create, edit, and delete tasks
- Set priorities and due dates
- Assign tasks to team members
- Add descriptions and tags
- Track task progress

### Authentication
- User login and logout
- User profile management
- Protected routes

## 🎨 Design System

The application features a modern glassmorphism design with:

- **Glass Cards**: Translucent backgrounds with blur effects
- **Gradient Accents**: Purple to pink gradient theme
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Layout**: Mobile-first design approach
- **Dark Theme**: Optimized for dark environments

## 🔮 Future Enhancements

- [ ] Drag and drop task reordering
- [ ] File attachments for tasks
- [ ] Time tracking functionality
- [ ] Email notifications
- [ ] Advanced filtering and sorting
- [ ] Project templates
- [ ] Calendar integration
- [ ] Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Provide steps to reproduce any bugs

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the React framework
- [Radix UI](https://radix-ui.com/) for accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://framer.com/motion/) for animations
- [Lucide](https://lucide.dev/) for beautiful icons

---

Built with ❤️ using modern web technologies
