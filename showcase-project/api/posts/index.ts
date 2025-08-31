import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const contentPath = path.join(process.cwd(), 'content', 'posts');
    
    console.log('Current working directory:', process.cwd());
    console.log('Content path:', contentPath);
    console.log('Content path exists:', fs.existsSync(contentPath));
    
    if (!fs.existsSync(contentPath)) {
      // Try alternative paths
      const altPath1 = path.join(process.cwd(), '..', 'content', 'posts');
      const altPath2 = path.join(__dirname, '..', '..', 'content', 'posts');
      console.log('Alt path 1:', altPath1, 'exists:', fs.existsSync(altPath1));
      console.log('Alt path 2:', altPath2, 'exists:', fs.existsSync(altPath2));
      
      return res.status(404).json({ 
        message: 'Content directory not found',
        debug: {
          cwd: process.cwd(),
          contentPath,
          altPath1,
          altPath2
        }
      });
    }

    const files = fs.readdirSync(contentPath);
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
      .filter(post => post.published);

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
}
