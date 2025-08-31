import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Try different possible paths for content in Vercel environment
    const possiblePaths = [
      path.join(process.cwd(), 'content', 'posts'),
      path.join(process.cwd(), '..', 'content', 'posts'),
      path.join(__dirname, '..', '..', 'content', 'posts'),
      path.join('/var/task', 'content', 'posts')
    ];
    
    let contentPath = '';
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        contentPath = testPath;
        break;
      }
    }
    
    console.log('Current working directory:', process.cwd());
    console.log('Found content path:', contentPath);
    
    if (!contentPath || !fs.existsSync(contentPath)) {
      return res.status(404).json({ 
        message: 'Content directory not found',
        debug: {
          cwd: process.cwd(),
          __dirname,
          testedPaths: possiblePaths.map(p => ({ path: p, exists: fs.existsSync(p) }))
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
