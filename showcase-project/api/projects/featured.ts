import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { resolveImagePath } from '../utils/assets.js';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Try multiple path strategies for Vercel deployment
    const possiblePaths = [
      path.join(process.cwd(), 'content', 'projects'),
      path.join(__dirname, '..', '..', 'content', 'projects'),
      path.join('/vercel/path0', 'showcase-project', 'content', 'projects')
    ];

    let projectsDir = '';
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        projectsDir = possiblePath;
        break;
      }
    }

    if (!projectsDir) {
      return res.status(500).json({ 
        message: 'Projects directory not found',
        searchedPaths: possiblePaths 
      });
    }

    const files = fs.readdirSync(projectsDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    const projects = markdownFiles.map(file => {
      const filePath = path.join(projectsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      
      return {
        slug: file.replace('.md', ''),
        title: data.title,
        description: data.description,
        category: data.category,
        tags: data.tags || [],
        cover: resolveImagePath(data.cover || data.image, 'project'),
        featured: data.featured || false,
        date: data.date,
        status: data.status,
        github: data.github,
        live: data.live,
        tech: data.tech || []
      };
    });

    // Filter only featured projects
    const featuredProjects = projects.filter(project => project.featured);

    res.json(featuredProjects);
  } catch (error) {
    console.error('Error loading featured projects:', error);
    res.status(500).json({ 
      message: 'Failed to load featured projects',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
