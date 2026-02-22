import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { fileURLToPath } from 'url';
import { resolveImagePath } from '../utils/assets.js';
import { preprocessMarkdown, postprocessHtml } from '../utils/markdown.js';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { slug } = req.query;
  
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ message: 'Project slug is required' });
  }

  try {
    // Try multiple path strategies for Vercel deployment
    const possiblePaths = [
      path.join(process.cwd(), 'content', 'projects'),
      path.join('/var/task', 'content', 'projects'),
      path.join(__dirname, '..', 'content', 'projects'),
      path.join(__dirname, '..', '..', 'content', 'projects'),
      path.join(process.cwd(), '..', 'content', 'projects')
    ];
    
    let contentPath: string | null = null;
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        contentPath = testPath;
        break;
      }
    }
    
    if (!contentPath) {
      return res.status(404).json({ message: 'Content directory not found' });
    }

    const files = fs.readdirSync(contentPath);
    
    // Find the project by slug or filename
    const projectFile = files.find(file => {
      if (!file.endsWith('.md')) return false;
      
      const filePath = path.join(contentPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);
      
      return data.slug === slug || file.replace('.md', '') === slug;
    });
    
    if (!projectFile) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const filePath = path.join(contentPath, projectFile);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    const project = {
      id: 1,
      title: data.title,
      slug: data.slug || projectFile.replace('.md', ''),
      description: data.description || data.excerpt || content.substring(0, 200) + '...',
      tags: data.tags || [],
      tech: data.tech || data.tech_stack || [],
      status: data.status || 'completed',
      cover: resolveImagePath(data.cover || data.image, 'project'),
      links: data.links || [],
      github: data.github || data.githubUrl,
      live: data.liveUrl,
      featured: data.featured || false,
      order: data.order || 0,
      createdAt: new Date(data.date || Date.now()),
      updatedAt: new Date(data.date || Date.now()),
      content: postprocessHtml(await marked(preprocessMarkdown(content)))
    };
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Failed to fetch project' });
  }
}
