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

  // Check if this is a global search request
  const searchQuery = req.query.q;
  const isGlobalSearch = searchQuery && typeof searchQuery === 'string';

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
    let debugInfo = {
      cwd: process.cwd(),
      dirname: __dirname,
      testedPaths: [] as string[]
    };
    
    for (const testPath of possiblePaths) {
      debugInfo.testedPaths.push(testPath);
      if (fs.existsSync(testPath)) {
        contentPath = testPath;
        break;
      }
    }
    
    if (!contentPath) {
      return res.status(500).json({ 
        message: 'Content directory not found',
        debug: debugInfo
      });
    }

    const files = fs.readdirSync(contentPath);
    const projects = files
      .filter(file => file.endsWith('.md'))
      .map((file, index) => {
        const filePath = path.join(contentPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        
        return {
          id: index + 1,
          title: data.title,
          slug: data.slug || file.replace('.md', ''),
          description: data.description || content.substring(0, 200) + '...',
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
          content
        };
      })
      .sort((a, b) => b.order - a.order);

    // If this is a global search request, also search posts and return combined results
    if (isGlobalSearch) {
      const searchTerm = searchQuery.toLowerCase();
      
      // Filter projects
      const filteredProjects = projects.filter(project => 
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.content.toLowerCase().includes(searchTerm) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        project.tech.some(tech => tech.toLowerCase().includes(searchTerm))
      ).map(p => ({ ...p, type: 'project' }));

      // Also search posts
      let posts: any[] = [];
      const postsPath = path.join(process.cwd(), 'content', 'posts');
      if (fs.existsSync(postsPath)) {
        const postFiles = fs.readdirSync(postsPath);
        posts = postFiles
          .filter(file => file.endsWith('.md'))
          .map((file, index) => {
            const filePath = path.join(postsPath, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const { data, content } = matter(fileContent);
            
            return {
              id: index + 1,
              title: data.title,
              slug: data.slug || file.replace('.md', ''),
              excerpt: data.excerpt || content.substring(0, 200) + '...',
              tags: data.tags || [],
              category: data.category || 'General',
              published: data.published !== false,
              featured: data.featured || false,
              publishedAt: new Date(data.date),
              content,
              type: 'post'
            };
          })
          .filter(post => post.published)
          .filter(post => 
            post.title.toLowerCase().includes(searchTerm) ||
            post.excerpt.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            post.category.toLowerCase().includes(searchTerm)
          );
      }

      return res.json([...filteredProjects, ...posts]);
    }

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
}
