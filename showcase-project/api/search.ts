import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const searchQuery = req.query.q;
  if (!searchQuery || typeof searchQuery !== 'string') {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const searchTerm = searchQuery.toLowerCase();
    console.log('Search query:', searchTerm);
    const results: any[] = [];

    // Helper function to try multiple paths (like in projects/index.ts)
    const findContentPath = (contentType: string) => {
      const possiblePaths = [
        path.join(process.cwd(), 'content', contentType),
        path.join('/var/task', 'content', contentType),
        path.join(__dirname, '..', 'content', contentType),
        path.join(__dirname, '..', '..', 'content', contentType),
        path.join(process.cwd(), '..', 'content', contentType)
      ];
      
      let debugInfo = {
        cwd: process.cwd(),
        dirname: __dirname,
        testedPaths: [] as string[]
      };
      
      for (const testPath of possiblePaths) {
        debugInfo.testedPaths.push(testPath);
        try {
          if (fs.existsSync(testPath)) {
            console.log(`Found ${contentType} path:`, testPath);
            return testPath;
          }
        } catch (err) {
          console.error(`Error checking path ${testPath}:`, err);
        }
      }
      
      console.log(`No ${contentType} path found. Debug info:`, debugInfo);
      return null;
    };

    // Search posts
    const postsPath = findContentPath('posts');
    if (postsPath) {
      try {
        const postFiles = fs.readdirSync(postsPath);
        console.log('Found post files:', postFiles);
        
        const matchingPosts = postFiles
          .filter(file => file.endsWith('.md'))
          .map((file, index) => {
            try {
              const filePath = path.join(postsPath, file);
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
                content,
                type: 'post'
              };
            } catch (err) {
              console.error(`Error processing post file ${file}:`, err);
              return null;
            }
          })
          .filter(post => post !== null)
          .filter(post => {
            if (!post.published) return false;
            
            const title = post.title.toLowerCase();
            const excerpt = post.excerpt.toLowerCase();
            const content = post.content.toLowerCase();
            
            const matches = title.includes(searchTerm) ||
                           excerpt.includes(searchTerm) ||
                           content.includes(searchTerm) ||
                           post.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm)) ||
                           post.category.toLowerCase().includes(searchTerm);
            
            if (matches) {
              console.log('Post match:', post.title);
            }
            return matches;
          });

        results.push(...matchingPosts);
      } catch (err) {
        console.error('Error reading posts directory:', err);
      }
    }

    // Search projects
    const projectsPath = findContentPath('projects');
    if (projectsPath) {
      try {
        const projectFiles = fs.readdirSync(projectsPath);
        console.log('Found project files:', projectFiles);
        
        const matchingProjects = projectFiles
          .filter(file => file.endsWith('.md'))
          .map((file, index) => {
            try {
              const filePath = path.join(projectsPath, file);
              const fileContent = fs.readFileSync(filePath, 'utf8');
              const { data, content } = matter(fileContent);
              
              return {
                id: index + 1,
                title: data.title,
                slug: data.slug || file.replace('.md', ''),
                description: data.description || data.excerpt || content.substring(0, 200) + '...',
                tags: data.tags || [],
                tech: data.tech || data.tech_stack || [],
                content,
                type: 'project'
              };
            } catch (err) {
              console.error(`Error processing project file ${file}:`, err);
              return null;
            }
          })
          .filter(project => project !== null)
          .filter(project => {
            const title = project.title.toLowerCase();
            const description = project.description.toLowerCase();
            const content = project.content.toLowerCase();
            
            const matches = title.includes(searchTerm) ||
                           description.includes(searchTerm) ||
                           content.includes(searchTerm) ||
                           project.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm)) ||
                           project.tech.some((tech: string) => tech.toLowerCase().includes(searchTerm));
            
            if (matches) {
              console.log('Project match:', project.title);
            }
            return matches;
          });

        results.push(...matchingProjects);
      } catch (err) {
        console.error('Error reading projects directory:', err);
      }
    }

    console.log('Total search results:', results.length);
    res.json(results);
  } catch (error) {
    console.error('Error searching content:', error);
    res.status(500).json({ message: 'Failed to search content' });
  }
}
