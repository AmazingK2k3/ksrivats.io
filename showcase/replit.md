# Replit.md - Personal Portfolio & Digital Garden

## Overview

This is a modern full-stack web application built for a personal portfolio and digital garden. The application serves as a digital home for Paras Chopra, an AI researcher at Lossfunk, featuring a blog, project showcase, and contact system. The architecture follows a clean separation between frontend (React), backend (Express), and data persistence (PostgreSQL with Drizzle ORM).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with a custom cream/sage color palette inspired by Anthropic's design
- **UI Components**: Radix UI components with shadcn/ui styling system
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **API Design**: RESTful endpoints with consistent error handling

### Data Storage
- **Primary Database**: PostgreSQL hosted on Neon (serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for database schema management
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple

## Key Components

### Content Management
- **Posts**: Blog posts with markdown content, tags, categories, and publishing status
- **Projects**: Portfolio projects with descriptions, links, and status tracking
- **Users**: Basic user authentication system (likely for admin access)
- **Contacts**: Contact form submissions with response tracking

### UI System
- **Design System**: Custom theme based on cream/sage color palette
- **Typography**: Inter for UI, Crimson Pro for headings, JetBrains Mono for code
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode**: Theme provider with system preference detection
- **Animations**: CSS animations and transitions for smooth interactions

### Search & Discovery
- **Full-text Search**: Posts searchable by title and content
- **Category Filtering**: Posts organized by categories
- **Tag System**: Multiple tags per post for topic organization
- **Featured Content**: Highlighted posts and projects

## Data Flow

1. **Content Creation**: Markdown files in `/content` directory define posts and projects
2. **Database Seeding**: Content is loaded into PostgreSQL via Drizzle ORM
3. **API Layer**: Express routes serve content through RESTful endpoints
4. **Frontend Consumption**: React components fetch data using TanStack Query
5. **Static Generation**: Vite builds optimized static assets
6. **Contact Processing**: Form submissions stored in database for follow-up

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **UI Components**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS for utility-first styling
- **Data Fetching**: TanStack Query for sophisticated caching and synchronization
- **Form Handling**: React Hook Form with Hookform Resolvers for validation
- **Date Handling**: date-fns for date manipulation and formatting

### Development Tools
- **Build**: Vite with React plugin and runtime error overlay
- **TypeScript**: Full type safety across frontend and backend
- **Database Tools**: Drizzle Kit for migrations and schema management
- **Development**: tsx for TypeScript execution and hot reloading

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React app to optimized static files
2. **Backend Build**: esbuild bundles Express server for production
3. **Database Preparation**: Drizzle Kit pushes schema changes to production database
4. **Asset Optimization**: Vite handles code splitting and asset optimization

### Environment Configuration
- **Development**: Local development with hot module replacement
- **Production**: Bundled server with static file serving
- **Database**: Environment-specific DATABASE_URL configuration
- **Session Management**: PostgreSQL-backed sessions for scalability

### Content Management
- **Static Content**: Markdown files in `/content` directory
- **Dynamic Content**: Database-driven posts and projects
- **Search Integration**: Full-text search capabilities built into the database layer
- **Contact System**: Form submissions stored and managed through admin interface

The application is designed to be deployed on platforms like Replit, Vercel, or Railway, with the database hosted on Neon for serverless scaling. The architecture supports both static content generation and dynamic content management, making it suitable for a personal portfolio that can grow into a full content management system.

## Recent Changes (January 2025)

### UI Updates
- Updated heading colors to #461031 (purple) for light theme and #F9DBBB (cream) for dark theme
- Fixed logo usage - dark logo for light theme, light logo for dark theme
- Simplified animations - removed fancy effects, kept clean floating animations
- Updated button fonts to match heading fonts (Inter, sans-serif)
- Removed distracting background elements for cleaner aesthetic

### Quartz-Inspired Content Management System
- Implemented markdown-based content management system inspired by Quartz
- Created `/content/posts/` and `/content/projects/` directories for easy content creation
- Built content loader that automatically reads markdown files and serves them through API
- Added YAML front matter parsing for metadata (title, tags, categories, etc.)
- Content can be easily created, edited, and deleted by just adding/modifying markdown files
- Automatic styling applied to markdown content with search functionality
- No code changes needed for content management - just markdown files

### Content Structure
- Posts and projects are now driven by markdown files in the content directory
- Front matter includes title, slug, date, tags, category, excerpt, featured status
- Projects include additional fields for tech stack, status, and links
- Search functionality works across all markdown-based content
- Tags and categories are automatically extracted from markdown files

This creates a true digital garden experience where new content automatically appears on the website with proper styling and searchability, similar to how Quartz works for knowledge management.