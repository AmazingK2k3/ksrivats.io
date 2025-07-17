# Kaushik Srivatsan's Portfolio Repository

This repository contains two main components of my digital portfolio:

## 🏗️ Structure

### 📚 Quartz (Static Site/Blog)
- **Purpose**: Knowledge garden, blog, and technical documentation
- **Technology**: Quartz (Obsidian-based static site generator)
- **Content**: Technical articles, project documentation, thoughts, and learning notes
- **Deployment**: GitHub Pages or similar static hosting
- **Location**: Root directory (main Quartz files)

### 🎨 Showcase (Portfolio Application)
- **Purpose**: Interactive portfolio showcasing projects, creatives, and professional work
- **Technology**: React + Vite + TypeScript + Tailwind CSS
- **Features**: Project galleries, blog posts, creative works, contact forms
- **Deployment**: Vercel/Netlify
- **Location**: `showcase-project/` directory

## 🚀 Getting Started

### Quartz Development
```bash
# Install dependencies
npm install

# Start development server
npx quartz build --serve

# Build for production
npx quartz build
```

### Showcase Development
```bash
# Navigate to showcase directory
cd showcase-project

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Repository Structure
```
├── content/                    # Quartz content (markdown files)
├── quartz/                     # Quartz engine source
├── static/                     # Static assets for Quartz
├── showcase-project/           # Showcase portfolio application
│   ├── client/                 # Frontend React application
│   ├── server/                 # Backend API (if needed)
│   ├── content/                # Content for portfolio
│   └── package.json
├── package.json                # Quartz dependencies
├── quartz.config.ts           # Quartz configuration
└── README.md                  # This file
```

## 🔗 Live Sites

- **Quartz Blog**: [ksrivats.io](https://ksrivats.io) *(Static site)*
- **Portfolio Showcase**: [portfolio.ksrivats.io](https://portfolio.ksrivats.io) *(Interactive app)*

## 🛠️ Technologies Used

**Quartz Site:**
- Quartz v4
- TypeScript
- Obsidian-flavored Markdown
- SCSS

**Showcase App:**
- React 18
- Vite
- TypeScript
- Tailwind CSS
- Shadcn/ui Components
- Drizzle ORM

## 📝 Content Management

### Adding Blog Posts (Quartz)
1. Create new `.md` files in `content/` directory
2. Use frontmatter for metadata
3. Run `npx quartz build` to generate site

### Adding Portfolio Projects (Showcase)
1. Add project data to `showcase-project/content/projects/`
2. Update the content management system
3. Run `npm run build` in showcase directory

## 🚢 Deployment

Both components can be deployed independently:

- **Quartz**: Builds to static files, can be deployed to any static host
- **Showcase**: Full-stack application, suitable for Vercel, Netlify, or similar platforms

## 📬 Contact

For questions about this repository or collaboration opportunities:

- **Email**: contact@ksrivats.io
- **LinkedIn**: [linkedin.com/in/kaushik-srivatsan](https://linkedin.com/in/kaushik-srivatsan)
- **GitHub**: [@AmazingK2k3](https://github.com/AmazingK2k3)

---

*This repository represents my journey in technology, creativity, and professional development.*
