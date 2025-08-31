import { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const creativesPath = join(process.cwd(), 'content', 'creatives');
    const files = readdirSync(creativesPath);
    
    const creatives = files
      .filter(file => file.endsWith('.md'))
      .map((file, index) => {
        const content = readFileSync(join(creativesPath, file), 'utf-8');
        const { data } = matter(content);
        
        return {
          id: index + 1,
          title: data.title || file.replace('.md', ''),
          slug: data.slug || file.replace('.md', ''),
          description: data.description || '',
          tags: data.tags || [],
          category: data.category || 'Art',
          featured: data.featured || false,
          image: data.image || data.cover,
          createdAt: new Date(data.date || Date.now()),
          updatedAt: new Date(data.date || Date.now())
        };
      });
      
    res.json(creatives);
  } catch (error) {
    console.error('Error fetching creatives:', error);
    res.status(500).json({ message: 'Failed to fetch creatives' });
  }
}
