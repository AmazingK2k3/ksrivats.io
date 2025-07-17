import Fuse from 'fuse.js';

interface SearchableContent {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category?: string;
  type: 'post' | 'project';
  url: string;
}

class SearchEngine {
  private fuse: Fuse<SearchableContent> | null = null;
  private content: SearchableContent[] = [];

  constructor() {
    this.initializeSearch();
  }

  private async initializeSearch() {
    try {
      // Fetch all searchable content
      const [postsResponse, projectsResponse] = await Promise.all([
        fetch('/api/posts'),
        fetch('/api/projects')
      ]);

      const posts = await postsResponse.json();
      const projects = await projectsResponse.json();

      // Transform to searchable format
      this.content = [
        ...posts.map((post: any) => ({
          id: post.id.toString(),
          title: post.title,
          content: post.content,
          tags: post.tags || [],
          category: post.category,
          type: 'post' as const,
          url: `/blog/${post.slug}`,
        })),
        ...projects.map((project: any) => ({
          id: project.id.toString(),
          title: project.title,
          content: project.description,
          tags: project.tags || [],
          type: 'project' as const,
          url: `/projects/${project.slug}`,
        })),
      ];

      // Initialize Fuse.js
      this.fuse = new Fuse(this.content, {
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'content', weight: 0.3 },
          { name: 'tags', weight: 0.2 },
          { name: 'category', weight: 0.1 },
        ],
        threshold: 0.3,
        includeScore: true,
      });
    } catch (error) {
      console.error('Failed to initialize search:', error);
    }
  }

  search(query: string): SearchableContent[] {
    if (!this.fuse || !query.trim()) {
      return [];
    }

    const results = this.fuse.search(query);
    return results.map((result: any) => result.item);
  }

  getContent(): SearchableContent[] {
    return this.content;
  }
}

export const searchEngine = new SearchEngine();
