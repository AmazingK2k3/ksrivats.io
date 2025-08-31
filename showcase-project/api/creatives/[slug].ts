import { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { slug } = req.query;
  
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ message: 'Creative slug is required' });
  }

  try {
    // Try multiple path strategies for Vercel deployment
    const possiblePaths = [
      join(process.cwd(), 'content', 'creatives'),
      join('/var/task', 'content', 'creatives'),
      join(__dirname, '..', 'content', 'creatives'),
      join(__dirname, '..', '..', 'content', 'creatives'),
      join(process.cwd(), '..', 'content', 'creatives')
    ];
    
    let creativesPath: string | null = null;
    for (const testPath of possiblePaths) {
      if (existsSync(testPath)) {
        creativesPath = testPath;
        break;
      }
    }
    
    if (!creativesPath) {
      return res.status(404).json({ message: 'Content directory not found' });
    }
    
    const files = readdirSync(creativesPath);
    
    const creativeFile = files.find(file => {
      const content = readFileSync(join(creativesPath!, file), 'utf-8');
      const { data } = matter(content);
      return data.slug === slug || file.replace('.md', '') === slug;
    });
    
    if (!creativeFile) {
      return res.status(404).json({ message: 'Creative not found' });
    }
    
    const content = readFileSync(join(creativesPath!, creativeFile), 'utf-8');
    const { data, content: markdownContent } = matter(content);
    
    const creative = {
      id: 1,
      title: data.title || creativeFile.replace('.md', ''),
      slug: data.slug || creativeFile.replace('.md', ''),
      description: data.description || '',
      content: await marked(markdownContent),
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
