# Personal Portfolio Website

A modern, Quartz-inspired portfolio website built with React, TypeScript, and Express. This website provides a seamless experience for creating and managing content through markdown files, similar to how Quartz works.

## ✨ Key Features

### 🚀 Quartz-like Markdown Management
- **Automatic Content Loading**: Drop markdown files into `content/posts/` or `content/projects/` and they automatically appear on your website
- **YAML Frontmatter Support**: Rich metadata support using gray-matter parser
- **Real-time Updates**: Content updates when you modify markdown files (in development mode)
- **Markdown to HTML**: Automatic conversion with GitHub Flavored Markdown support

### 🎨 Modern UI/UX
- **Responsive Design**: Optimized for all devices
- **Dark/Light Theme**: Built-in theme switching
- **Beautiful Typography**: Carefully crafted reading experience
- **Smooth Animations**: Framer Motion powered transitions

### 🔍 Advanced Content Features
- **Full-text Search**: Search across all posts and projects
- **Tag System**: Organize content with tags
- **Category Filtering**: Group content by categories
- **Featured Content**: Highlight important posts and projects

## 📁 Project Structure

```
showcase/
├── content/                    # Markdown content (Quartz-like)
│   ├── posts/                 # Blog posts
│   │   ├── post1.md
│   │   └── post2.md
│   └── projects/              # Project pages
│       ├── project1.md
│       └── project2.md
├── client/                    # React frontend
│   └── src/
│       ├── components/        # Reusable UI components
│       ├── pages/            # Route components
│       └── lib/              # Utilities
├── server/                    # Express backend
│   ├── content-loader.ts     # Markdown processing
│   └── routes.ts             # API endpoints
└── shared/                    # Shared types
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and Install**
   ```bash
   cd showcase
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to `http://localhost:5000`

## 📝 Creating Content

### Blog Posts

Create a new file in `content/posts/my-post.md`:

```markdown
---
title: "My Amazing Blog Post"
slug: "my-amazing-post"
date: "2024-01-15"
tags: ["tech", "javascript", "react"]
category: "Technology"
excerpt: "A brief description of this post"
featured: true
---

# My Amazing Blog Post

Your content here using **Markdown** with full GitHub Flavored Markdown support!

- Lists work
- [Links work](https://example.com)
- `Code blocks work`

```javascript
const example = "Code highlighting works too!";
```
```

### Projects

Create a new file in `content/projects/my-project.md`:

```markdown
---
title: "Awesome Project"
slug: "awesome-project"
date: "2024-01-15"
tags: ["react", "typescript"]
status: "completed"
featured: true
github: "https://github.com/username/project"
link: "https://project-demo.com"
---

# Awesome Project

Detailed description of your project with markdown formatting.

## Features
- Feature 1
- Feature 2

## Tech Stack
- React
- TypeScript
- Tailwind CSS
```

### Frontmatter Reference

#### Posts
- `title`: Post title
- `slug`: URL slug (must be unique)
- `date`: Publication date (YYYY-MM-DD)
- `tags`: Array of tags
- `category`: Post category
- `excerpt`: Brief description
- `featured`: Boolean for homepage display

#### Projects
- `title`: Project title
- `slug`: URL slug (must be unique)
- `date`: Creation date
- `tags`: Array of tags
- `status`: "active", "completed", or "archived"
- `featured`: Boolean for homepage display
- `github`: GitHub repository URL
- `link`: Live demo URL

## 🛠 Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run check`: Run TypeScript type checking

### Adding New Features

1. **API Endpoints**: Add routes in `server/routes.ts`
2. **Frontend Pages**: Create components in `client/src/pages/`
3. **UI Components**: Add reusable components in `client/src/components/`

### Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express.js, TypeScript
- **Content**: Gray-matter, Remark (Markdown processing)
- **Build Tool**: Vite
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query
- **Animations**: Framer Motion

## 📦 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Environment Variables

Create a `.env` file:

```env
NODE_ENV=production
PORT=5000
```

## 🎯 Roadmap

- [ ] **RSS Feed Generation**
- [ ] **SEO Optimization**
- [ ] **Image Optimization**
- [ ] **Code Syntax Highlighting**
- [ ] **Table of Contents Generation**
- [ ] **Related Posts Algorithm**
- [ ] **Comment System Integration**
- [ ] **Analytics Integration**

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy blogging! 🎉** Your Quartz-like portfolio website is ready to showcase your thoughts and projects to the world.
