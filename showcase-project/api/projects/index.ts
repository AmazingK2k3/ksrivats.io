import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const contentPath = path.join(process.cwd(), 'content', 'projects');
    
    if (!fs.existsSync(contentPath)) {
      return res.status(404).json({ message: 'Content directory not found' });
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
          cover: data.cover || data.image,
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

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
}
