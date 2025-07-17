import { posts, projects, contacts, users, type User, type InsertUser, type Post, type InsertPost, type Project, type InsertProject, type Contact, type InsertContact } from "@shared/schema";
import { loadPosts, loadProjects, loadCreatives } from "./content-loader";
import { watch } from "chokidar";
import { join } from "path";

interface Creative {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  tags: string[];
  category: string;
  featured: boolean;
  cover?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Posts
  getPosts(): Promise<Post[]>;
  getPost(slug: string): Promise<Post | undefined>;
  getFeaturedPosts(): Promise<Post[]>;
  getPostsByCategory(category: string): Promise<Post[]>;
  getPostsByTag(tag: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(slug: string, post: Partial<InsertPost>): Promise<Post | undefined>;
  searchPosts(query: string): Promise<Post[]>;
  
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(slug: string): Promise<Project | undefined>;
  getFeaturedProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(slug: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  
  // Creatives
  getCreatives(): Promise<Creative[]>;
  getCreative(slug: string): Promise<Creative | undefined>;
  getFeaturedCreatives(): Promise<Creative[]>;
  
  // Contacts
  getContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  markContactResponded(id: number): Promise<Contact | undefined>;
  
  // Content management
  refreshContent(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<string, Post>;
  private projects: Map<string, Project>;
  private creatives: Map<string, Creative>;
  private contacts: Map<number, Contact>;
  private currentUserId: number;
  private currentPostId: number;
  private currentProjectId: number;
  private currentContactId: number;
  private refreshTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.projects = new Map();
    this.creatives = new Map();
    this.contacts = new Map();
    this.currentUserId = 1;
    this.currentPostId = 1;
    this.currentProjectId = 1;
    this.currentContactId = 1;
    
    this.initializeData();
    this.setupFileWatching();
  }

  private async initializeData() {
    // Load content from markdown files
    try {
      const markdownPosts = await loadPosts();
      markdownPosts.forEach(post => this.posts.set(post.slug, post));
      
      console.log(`Loaded ${markdownPosts.length} posts from markdown files`);
    } catch (error) {
      console.error('Error loading posts from markdown files:', error);
    }

    // Load projects from markdown files
    try {
      const markdownProjects = await loadProjects();
      markdownProjects.forEach(project => this.projects.set(project.slug, project));
      
      console.log(`Loaded ${markdownProjects.length} projects from markdown files`);
    } catch (error) {
      console.error('Error loading projects from markdown files:', error);
    }

    // Load creatives from markdown files
    try {
      const markdownCreatives = await loadCreatives();
      markdownCreatives.forEach(creative => this.creatives.set(creative.slug, creative));
      
      console.log(`Loaded ${markdownCreatives.length} creatives from markdown files`);
    } catch (error) {
      console.error('Error loading creatives from markdown files:', error);
    }
  }

  private setupFileWatching() {
    const postsPath = join(process.cwd(), 'content', 'posts');
    const projectsPath = join(process.cwd(), 'content', 'projects');
    const creativesPath = join(process.cwd(), 'content', 'creatives');
    
    // Watch for changes in posts directory
    watch(postsPath + '/**/*.md', { ignoreInitial: true })
      .on('add', (path) => {
        console.log(`New post file detected: ${path}`);
        this.debouncedRefresh();
      })
      .on('change', (path) => {
        console.log(`Post file changed: ${path}`);
        this.debouncedRefresh();
      })
      .on('unlink', (path) => {
        console.log(`Post file deleted: ${path}`);
        this.debouncedRefresh();
      });
    
    // Watch for changes in projects directory
    watch(projectsPath + '/**/*.md', { ignoreInitial: true })
      .on('add', (path) => {
        console.log(`New project file detected: ${path}`);
        this.debouncedRefresh();
      })
      .on('change', (path) => {
        console.log(`Project file changed: ${path}`);
        this.debouncedRefresh();
      })
      .on('unlink', (path) => {
        console.log(`Project file deleted: ${path}`);
        this.debouncedRefresh();
      });

    // Watch for changes in creatives directory
    watch(creativesPath + '/**/*.md', { ignoreInitial: true })
      .on('add', (path) => {
        console.log(`New creative file detected: ${path}`);
        this.debouncedRefresh();
      })
      .on('change', (path) => {
        console.log(`Creative file changed: ${path}`);
        this.debouncedRefresh();
      })
      .on('unlink', (path) => {
        console.log(`Creative file deleted: ${path}`);
        this.debouncedRefresh();
      });

  }

  private debouncedRefresh() {
    // Clear any existing timeout
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
    
    // Set a new timeout to refresh content after 500ms of inactivity
    this.refreshTimeout = setTimeout(() => {
      this.refreshContent();
    }, 500);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.published)
      .sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));
  }

  async getPost(slug: string): Promise<Post | undefined> {
    return this.posts.get(slug);
  }

  async getFeaturedPosts(): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.featured && post.published)
      .sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));
  }

  async getPostsByCategory(category: string): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.category === category && post.published)
      .sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));
  }

  async getPostsByTag(tag: string): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.tags?.includes(tag) && post.published)
      .sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const post: Post = { 
      ...insertPost, 
      id,
      updatedAt: new Date(),
      category: insertPost.category ?? null,
      excerpt: insertPost.excerpt ?? null,
      tags: insertPost.tags ?? null,
      publishedAt: insertPost.publishedAt ?? null,
      featured: insertPost.featured ?? null,
      published: insertPost.published ?? null,
    };
    this.posts.set(post.slug, post);
    return post;
  }

  async updatePost(slug: string, updateData: Partial<InsertPost>): Promise<Post | undefined> {
    const post = this.posts.get(slug);
    if (!post) return undefined;

    const updatedPost: Post = {
      ...post,
      ...updateData,
      updatedAt: new Date(),
    };
    this.posts.set(slug, updatedPost);
    return updatedPost;
  }

  async searchPosts(query: string): Promise<Post[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.posts.values())
      .filter(post => 
        post.published && (
          post.title.toLowerCase().includes(lowercaseQuery) ||
          post.content.toLowerCase().includes(lowercaseQuery) ||
          post.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        )
      )
      .sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));
  }

  async getProject(slug: string): Promise<Project | undefined> {
    return this.projects.get(slug);
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => project.featured)
      .sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = { 
      ...insertProject, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      link: insertProject.link ?? null,
      status: insertProject.status ?? null,
      content: insertProject.content ?? null,
      tags: insertProject.tags ?? null,
      featured: insertProject.featured ?? null,
      github: insertProject.github ?? null,
      cover: insertProject.cover ?? null,
    };
    this.projects.set(project.slug, project);
    return project;
  }

  async updateProject(slug: string, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(slug);
    if (!project) return undefined;

    const updatedProject: Project = {
      ...project,
      ...updateData,
      updatedAt: new Date(),
    };
    this.projects.set(slug, updatedProject);
    return updatedProject;
  }

  async getCreatives(): Promise<Creative[]> {
    return Array.from(this.creatives.values())
      .sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));
  }

  async getCreative(slug: string): Promise<Creative | undefined> {
    return this.creatives.get(slug);
  }

  async getFeaturedCreatives(): Promise<Creative[]> {
    return Array.from(this.creatives.values())
      .filter(creative => creative.featured)
      .sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = { 
      ...insertContact, 
      id,
      createdAt: new Date(),
      responded: false,
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async markContactResponded(id: number): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    if (!contact) return undefined;

    const updatedContact: Contact = {
      ...contact,
      responded: true,
    };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }

  async refreshContent(): Promise<void> {
    console.log('Refreshing content from markdown files...');
    
    // Clear existing content
    this.posts.clear();
    this.projects.clear();
    this.creatives.clear();
    
    // Reload content from markdown files
    try {
      const markdownPosts = await loadPosts();
      markdownPosts.forEach(post => this.posts.set(post.slug, post));
      console.log(`Refreshed ${markdownPosts.length} posts from markdown files`);
    } catch (error) {
      console.error('Error refreshing posts from markdown files:', error);
    }

    try {
      const markdownProjects = await loadProjects();
      markdownProjects.forEach(project => this.projects.set(project.slug, project));
      console.log(`Refreshed ${markdownProjects.length} projects from markdown files`);
    } catch (error) {
      console.error('Error refreshing projects from markdown files:', error);
    }

    try {
      const markdownCreatives = await loadCreatives();
      markdownCreatives.forEach(creative => this.creatives.set(creative.slug, creative));
      console.log(`Refreshed ${markdownCreatives.length} creatives from markdown files`);
    } catch (error) {
      console.error('Error refreshing creatives from markdown files:', error);
    }
  }
}

export const storage = new MemStorage();
