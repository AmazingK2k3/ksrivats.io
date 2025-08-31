import { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { slug } = req.query;
  
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ message: 'Creative slug is required' });
  }

  try {
    const creativesPath = join(process.cwd(), 'content', 'creatives');
    const files = readdirSync(creativesPath);
    
    const creativeFile = files.find(file => {
      const content = readFileSync(join(creativesPath, file), 'utf-8');
      const { data } = matter(content);
      return data.slug === slug || file.replace('.md', '') === slug;
    });
    
    if (!creativeFile) {
      return res.status(404).json({ message: 'Creative not found' });
    }
    
    const content = readFileSync(join(creativesPath, creativeFile), 'utf-8');
    const { data, content: markdownContent } = matter(content);
    
    const creative = {
      id: 1,
      title: data.title || creativeFile.replace('.md', ''),
      slug: data.slug || creativeFile.replace('.md', ''),
      description: data.description || '',
      content: markdownContent,
      tags: data.tags || [],
      category: data.category || 'Art',
      featured: data.featured || false,
      image: data.image || data.cover,
      createdAt: new Date(data.date || Date.now()),
      updatedAt: new Date(data.date || Date.now())
    };
    
    res.json(creative);
  } catch (error) {
    console.error('Error fetching creative:', error);
    res.status(500).json({ message: 'Failed to fetch creative' });
  }
}
