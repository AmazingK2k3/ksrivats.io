import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const query = req.query.q;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const contentPath = path.join(process.cwd(), 'content', 'posts');
    
    if (!fs.existsSync(contentPath)) {
      return res.status(404).json({ message: 'Content directory not found' });
    }

    const files = fs.readdirSync(contentPath);
    const lowercaseQuery = query.toLowerCase();
    
    const posts = files
      .filter(file => file.endsWith('.md'))
      .map((file, index) => {
        const filePath = path.join(contentPath, file);
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
        );    res.json(posts);
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ message: 'Failed to search posts' });
  }
}
