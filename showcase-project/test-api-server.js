import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, readdirSync } from 'fs';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Enable CORS manually
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());

// Posts endpoint
app.get('/api/posts', (req, res) => {
  try {
    const postsPath = join(process.cwd(), 'content', 'posts');
    const files = readdirSync(postsPath);
    
    const posts = files
      .filter(file => file.endsWith('.md'))
      .map((file, index) => {
        const content = readFileSync(join(postsPath, file), 'utf-8');
        const { data } = matter(content);
        
        return {
          id: index + 1,
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || '',
          tags: data.tags || [],
          category: data.category || 'General',
          published: true,
          featured: data.featured || false,
          publishedAt: new Date(data.date),
          createdAt: new Date(data.date),
          updatedAt: new Date(data.date),
        };
      });
      
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Projects endpoint
app.get('/api/projects', (req, res) => {
  try {
    const projectsPath = join(process.cwd(), 'content', 'projects');
    const files = readdirSync(projectsPath);
    
    const projects = files
      .filter(file => file.endsWith('.md'))
      .map((file, index) => {
        const content = readFileSync(join(projectsPath, file), 'utf-8');
        const { data } = matter(content);
        
        return {
          id: index + 1,
          title: data.title,
          slug: data.slug,
          description: data.description || '',
          tags: data.tags || [],
          tech: data.tech || data.tech_stack || [],
          status: data.status || 'completed',
          cover: data.cover || data.image,
          links: data.links || [],
          github: data.github || data.githubUrl,
          live: data.liveUrl,
          createdAt: new Date(data.date || Date.now()),
          updatedAt: new Date(data.date || Date.now())
        };
      });
      
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Creatives endpoint
app.get('/api/creatives', (req, res) => {
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
    res.status(500).json({ error: 'Failed to fetch creatives' });
  }
});

// Search endpoint
app.get('/api/search', (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }
  
  // Simplified search - just return empty results for testing
  res.json({ posts: [], projects: [], creatives: [] });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
