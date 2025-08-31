import { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
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
    let debugInfo = {
      cwd: process.cwd(),
      dirname: __dirname,
      testedPaths: [] as string[]
    };
    
    for (const path of possiblePaths) {
      debugInfo.testedPaths.push(path);
      if (existsSync(path)) {
        creativesPath = path;
        break;
      }
    }
    
    if (!creativesPath) {
      return res.status(500).json({ 
        message: 'Content directory not found',
        debug: debugInfo
      });
    }
    
    const files = readdirSync(creativesPath);
    
    if (files.length === 0) {
      return res.status(200).json({
        message: 'No creative files found',
        path: creativesPath,
        debug: debugInfo
      });
    }
    
    const creatives = files
      .filter(file => file.endsWith('.md'))
      .map((file, index) => {
        const content = readFileSync(join(creativesPath!, file), 'utf-8');
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
  } catch (error: any) {
    console.error('Error fetching creatives:', error);
    res.status(500).json({ 
      message: 'Failed to fetch creatives',
      error: error.message,
      stack: error.stack 
    });
  }
}
