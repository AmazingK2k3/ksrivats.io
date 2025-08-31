import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const query = req.query.q as string;
  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const lowercaseQuery = query.toLowerCase();
    
    // Load posts
    const postsPath = path.join(process.cwd(), 'content', 'posts');
    let posts: any[] = [];
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
            createdAt: new Date(data.date),
            updatedAt: new Date(data.date),
            content
          };
        })
        .filter(post => 
          post.published && (
            post.title.toLowerCase().includes(lowercaseQuery) ||
            post.content.toLowerCase().includes(lowercaseQuery) ||
            post.tags?.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery))
          )
        );
    }

    // Load projects
    const projectsPath = path.join(process.cwd(), 'content', 'projects');
    let projects: any[] = [];
    if (fs.existsSync(projectsPath)) {
      const projectFiles = fs.readdirSync(projectsPath);
      projects = projectFiles
        .filter(file => file.endsWith('.md'))
        .map((file, index) => {
          const filePath = path.join(projectsPath, file);
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
            cover: data.cover || data.image,
            content
          };
        })
        .filter(project => 
          project.title.toLowerCase().includes(lowercaseQuery) ||
          project.description.toLowerCase().includes(lowercaseQuery) ||
          project.tags?.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery)) ||
          project.tech?.some((tech: string) => tech.toLowerCase().includes(lowercaseQuery))
        );
    }

    res.json({ posts, projects, creatives: [] });
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ message: 'Failed to perform search' });
  }
}
