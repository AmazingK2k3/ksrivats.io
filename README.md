# My Portfolio Website

This repository contains my **portfolio website** built with modern web technologies, showcasing my projects, creative works, technical writing, and professional journey.

## 🏗️ Architecture Overview

This is a **full-stack TypeScript application** with a clean separation between frontend and backend:

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **Backend**: Express.js + TypeScript with file-based content management
- **Database**: In-memory storage with Markdown file parsing


## 🎨 Key Features

### 🖥️ Interactive Portfolio
- **Dynamic loading screen** with animated logo
- **Theme-aware design** (light/dark mode support)
- **Responsive layout** optimized for all devices
- **Smooth page transitions** and micro-interactions

### 📝 Content Management
- **Markdown-based content** for easy editing
- **Real-time file watching** for instant updates
- **Frontmatter support** for metadata and configuration
- **Automatic content parsing** from files to API endpoints

### 🔍 Advanced Search
- **Global search** across all content types
- **Real-time search results** with dropdown interface
- **Page-specific filtering** for projects and creatives
- **Tag-based organization** for better discoverability

### 📧 Contact System
- **Secure contact form** with spam protection
- **Email integration** using Nodemailer
- **Rate limiting** to prevent abuse
- **Input validation** and sanitization

### 🛡️ Security Features
- **XSS prevention** with input sanitization
- **Rate limiting** for API endpoints
- **CORS configuration** for secure cross-origin requests
- **Environment-based configuration** for sensitive data

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git for version control

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/AmazingK2k3/ksrivats.io.git
cd ksrivats.io

# Install dependencies
npm install

# Start development server (runs both frontend and backend)
npm run dev

# Access the website
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
```

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
showcase-project/
├── 📱 client/                  # Frontend React Application
│   ├── public/                 # Static assets (logos, images)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # Base UI components (buttons, forms)
│   │   │   ├── loading-screen.tsx
│   │   │   ├── navigation.tsx
│   │   │   └── ...
│   │   ├── pages/             # Route-specific page components
│   │   │   ├── home.tsx
│   │   │   ├── projects.tsx
│   │   │   ├── blog.tsx
│   │   │   └── ...
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions & configurations
│   │   └── App.tsx            # Main app component with routing
│   └── index.html
├── 🌐 server/                  # Backend Express.js Application
│   ├── index.ts               # Server entry point & middleware
│   ├── routes.ts              # API route definitions
│   ├── storage.ts             # Database operations & in-memory storage
│   ├── content-loader.ts      # Markdown file parsing & content management
│   ├── email-service.ts       # Email functionality with Nodemailer
│   └── security.ts           # Security middleware & validation
├── 📝 content/                 # Markdown Content Files
│   ├── posts/                 # Blog posts and articles
│   ├── projects/              # Project descriptions and details
│   └── creatives/             # Creative works and art pieces
├── 🔗 shared/                  # Shared TypeScript Code
│   └── schema.ts              # Zod schemas for data validation
├── 📄 attached_assets/         # Design assets and media files
└── package.json               # Dependencies and scripts
```

## 🛠️ Technology Stack Deep Dive

### Frontend Technologies
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Full type safety across the application
- **Vite**: Lightning-fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Radix UI**: Accessible, unstyled UI components
- **Framer Motion**: Smooth animations and page transitions
- **Wouter**: Lightweight routing library
- **TanStack Query**: Powerful data fetching and caching

### Backend Technologies
- **Express.js**: Fast, minimal web framework for Node.js
- **TypeScript**: Type-safe server-side development
- **Drizzle ORM**: Lightweight, type-safe database toolkit
- **Zod**: Runtime type validation and parsing
- **Nodemailer**: Email sending capabilities
- **Gray Matter**: YAML frontmatter parsing for Markdown
- **Remark**: Markdown processing and HTML conversion

### Development Tools
- **ESBuild**: Ultra-fast JavaScript bundler
- **TSX**: TypeScript execution for development
- **Cross-env**: Cross-platform environment variables
- **Chokidar**: File watching for real-time updates

## 🎯 Core Functionalities

### 1. Content Management System
```typescript
// Automatic content loading from Markdown files
const posts = await loadPosts('./content/posts');
const projects = await loadProjects('./content/projects');

// Real-time file watching for development
watcher.on('change', () => refreshContent());
```

### 2. API Endpoints
- `GET /api/posts` - Retrieve all blog posts
- `GET /api/posts/featured` - Get featured posts
- `GET /api/projects` - Retrieve all projects
- `GET /api/projects/featured` - Get featured projects
- `GET /api/creatives` - Retrieve creative works
- `GET /api/search?q=query` - Global search across content
- `POST /api/contact` - Contact form submission

### 3. Data Flow Architecture
```
📝 Markdown Files → 🔄 Content Loader → 🗄️ In-Memory Storage → 🌐 API Routes → ⚛️ React Components
```

### 4. Theme System
- Automatic theme detection and switching
- Theme-aware logo loading for the loading screen
- Consistent design system across light/dark modes

## � Content Creation Guide

### Adding Blog Posts
1. Create a new `.md` file in `content/posts/`
2. Add frontmatter with metadata:
```yaml
---
title: "Your Post Title"
slug: "your-post-slug"
date: "2024-01-01"
tags: ["tag1", "tag2"]
category: "Technology"
excerpt: "Brief description"
featured: true
---
```
3. Write your content in Markdown
4. The post will automatically appear on the website

### Adding Projects
1. Create a new `.md` file in `content/projects/`
2. Include project-specific metadata:
```yaml
---
title: "Project Name"
slug: "project-slug"
date: "2024-01-01"
tags: ["React", "TypeScript"]
status: "completed"
tech_stack: ["React", "Node.js"]
cover: "/project-image.jpg"
links:
  - type: "live"
    url: "https://project-url.com"
    label: "Live Demo"
  - type: "github"
    url: "https://github.com/user/repo"
    label: "Source Code"
---
```

## 🔧 Configuration & Customization

### Environment Variables
Create a `.env.local` file:
```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Database (if using external DB)
DATABASE_URL=your-database-url
```

### Customizing the Design
- Modify `tailwind.config.ts` for design system changes
- Update `client/src/index.css` for custom CSS variables
- Edit component files in `client/src/components/` for UI changes

## 🚀 Deployment Guide

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `client/dist`
4. Deploy automatically on push

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set start command: `npm start`
3. Add environment variables
4. Deploy with automatic scaling

## 📊 Performance Features

- **Code splitting** for optimal loading
- **Image optimization** for fast rendering
- **Caching strategies** for API responses
- **Lazy loading** for improved performance
- **Progressive enhancement** for accessibility

## 🤝 Contributing

This is a personal portfolio, but if you find bugs or have suggestions:

1. Open an issue describing the problem
2. Fork the repository
3. Create a feature branch
4. Submit a pull request

## 📄 License

MIT License - feel free to use this as inspiration for your own portfolio!

---

**Built with ❤️ by Kaushik Srivatsan** | [Live Website](https://ksrivats.io) | [LinkedIn](https://linkedin.com/in/kaushik-srivatsan)
