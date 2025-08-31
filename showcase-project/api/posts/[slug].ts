import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { slug } = req.query;
  
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ message: 'Post slug is required' });
  }

  try {
    const contentPath = path.join(process.cwd(), 'content', 'posts');
    
    if (!fs.existsSync(contentPath)) {
      return res.status(404).json({ message: 'Content directory not found' });
    }

    const files = fs.readdirSync(contentPath);
    
    // Find the post by slug or filename
    const postFile = files.find(file => {
      if (!file.endsWith('.md')) return false;
      
      const filePath = path.join(contentPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);
      
      return data.slug === slug || file.replace('.md', '') === slug;
    });
    
    if (!postFile) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const filePath = path.join(contentPath, postFile);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    const post = {
      id: 1,
      title: data.title,
      slug: data.slug || postFile.replace('.md', ''),
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
    
    if (!post.published) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
}
