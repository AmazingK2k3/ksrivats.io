import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import type { Post, Project, InsertPost, InsertProject } from '@shared/schema';
import { preprocessMarkdown, postprocessHtml } from '@shared/markdown-utils';

// Define the project status type
type ProjectStatus = 'current' | 'completed' | 'archived';

interface Creative {
  id: number;
  title?: string;
  slug: string;
  description?: string;
  content: string;
  tags: string[];
  category: string;
  featured: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MarkdownFrontMatter {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  category?: string;
  excerpt?: string;
  featured?: boolean;
  hidden?: boolean;
  status?: string;
  tech_stack?: string[];
  tech?: string[]; // Added for technical stack
  description?: string;
  link?: string;
  github?: string;
  githubUrl?: string;
  liveUrl?: string;
  cover?: string;
  image?: string;
  order?: number; // Added for ordering
  links?: Array<{
    type: string;
    url: string;
    label: string;
  }>;
}

interface ParsedMarkdown {
  frontMatter: MarkdownFrontMatter;
  content: string;
  htmlContent: string;
}

async function parseMarkdown(content: string): Promise<ParsedMarkdown> {
  const { data, content: markdownContent } = matter(content);

  // Pre-process: ==highlight==, math placeholders
  const preprocessed = preprocessMarkdown(markdownContent);

  // Convert markdown to HTML
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(preprocessed);

  // Post-process: callout boxes
  const htmlContent = postprocessHtml(processedContent.toString());

  return {
    frontMatter: data as MarkdownFrontMatter,
    content: markdownContent.trim(),
    htmlContent
  };
}

async function loadMarkdownFiles(dirPath: string): Promise<ParsedMarkdown[]> {
  const files: ParsedMarkdown[] = [];
  
  try {
    console.log(`Loading markdown files from: ${dirPath}`);
    const entries = readdirSync(dirPath);
    console.log(`Found entries: ${entries.join(', ')}`);
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry);
      const stat = statSync(fullPath);
      
      if (stat.isFile() && entry.endsWith('.md')) {
        try {
          console.log(`Parsing file: ${entry}`);
          const content = readFileSync(fullPath, 'utf-8');
          const parsed = await parseMarkdown(content);
          console.log(`Successfully parsed: ${entry} with title: ${parsed.frontMatter.title}`);
          files.push(parsed);
        } catch (error) {
          console.error(`Error parsing ${fullPath}:`, error);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }
  
  console.log(`Loaded ${files.length} markdown files from ${dirPath}`);
  return files;
}

export async function loadPosts(): Promise<Post[]> {
  const postsPath = join(process.cwd(), 'content', 'posts');
  console.log(`Loading posts from: ${postsPath}`);
  const markdownFiles = await loadMarkdownFiles(postsPath);
  
  const posts = markdownFiles
    .map((file, index) => ({
      id: index + 1,
      title: file.frontMatter.title,
      slug: file.frontMatter.slug,
      content: file.htmlContent,
      excerpt: file.frontMatter.excerpt || '',
      tags: file.frontMatter.tags || [],
      category: file.frontMatter.category || 'General',
      published: !file.frontMatter.hidden,  // hidden posts are unpublished in storage
      featured: file.frontMatter.featured || false,
      publishedAt: new Date(file.frontMatter.date),
      createdAt: new Date(file.frontMatter.date),
      updatedAt: new Date(file.frontMatter.date),
    }));

  console.log(`Loaded ${posts.length} posts`);
  return posts;
}

export async function loadProjects(): Promise<Project[]> {
  const projectsPath = join(process.cwd(), 'content', 'projects');
  console.log(`Loading projects from: ${projectsPath}`);
  const markdownFiles = await loadMarkdownFiles(projectsPath);
  
  const projects = markdownFiles.map((file, index) => {
    // Debug logging for each file
    if (file.frontMatter.title === "Zeitgeist Magazine") {
      console.log(`Zeitgeist frontMatter.cover: ${file.frontMatter.cover}`);
      console.log(`Zeitgeist frontMatter.image: ${file.frontMatter.image}`);
    }
    
    return {
      id: index + 1,
      title: file.frontMatter.title,
      slug: file.frontMatter.slug,
      description: file.frontMatter.description || '',
      content: file.htmlContent,
      status: (file.frontMatter.status as ProjectStatus) || 'completed',
      tags: file.frontMatter.tags || [],
      tech: file.frontMatter.tech || file.frontMatter.tech_stack || [],
      link: file.frontMatter.link || null,
      github: file.frontMatter.github || null,
      category: file.frontMatter.category || 'General',
      featured: file.frontMatter.featured || false,
      cover: file.frontMatter.cover || file.frontMatter.image || null,
      order: file.frontMatter.order || 0,
      publishedAt: new Date(file.frontMatter.date),
      createdAt: new Date(file.frontMatter.date),
      updatedAt: new Date(file.frontMatter.date),
    };
  });

  // Debug logging for cover fields
  projects.forEach(project => {
    if (project.cover) {
      console.log(`Project "${project.title}" has cover: ${project.cover}`);
    }
  });
  
  console.log(`Loaded ${projects.length} projects`);
  return projects.sort((a, b) => a.order - b.order);
}

export function savePost(post: InsertPost): void {
  const postsPath = join(process.cwd(), 'content', 'posts');
  const filename = `${post.slug}.md`;
  const filepath = join(postsPath, filename);
  
  const frontMatter = `---
title: "${post.title}"
slug: "${post.slug}"
date: "${post.publishedAt || new Date().toISOString().split('T')[0]}"
tags: ${JSON.stringify(post.tags || [])}
category: "${post.category || 'General'}"
excerpt: "${post.excerpt || ''}"
featured: ${post.featured || false}
---

${post.content}`;

  writeFileSync(filepath, frontMatter);
}

export async function loadCreatives(): Promise<Creative[]> {
  const creativesPath = join(process.cwd(), 'content', 'creatives');
  const markdownFiles = await loadMarkdownFiles(creativesPath);
  
  return markdownFiles.map((file, index) => ({
    id: index + 1,
    title: file.frontMatter.title,
    slug: file.frontMatter.slug,
    description: file.frontMatter.description || file.frontMatter.excerpt || '',
    content: file.htmlContent,
    tags: file.frontMatter.tags || [],
    category: file.frontMatter.category || 'Art',
    featured: file.frontMatter.featured || false,
    image: file.frontMatter.image || file.frontMatter.cover || undefined,
    createdAt: new Date(file.frontMatter.date),
    updatedAt: new Date(file.frontMatter.date),
  }));
}

export function saveProject(project: InsertProject): void {
  const projectsPath = join(process.cwd(), 'content', 'projects');
  const filename = `${project.slug}.md`;
  const filepath = join(projectsPath, filename);
  
  const links = [];
  if (project.github) {
    links.push({ type: 'github', url: project.github, label: 'GitHub' });
  }
  if (project.link) {
    links.push({ type: 'live', url: project.link, label: 'Live Demo' });
  }
  
  const frontMatter = `---
title: "${project.title}"
slug: "${project.slug}"
date: "${new Date().toISOString().split('T')[0]}"
tags: ${JSON.stringify(project.tags || [])}
status: "${project.status || 'active'}"
featured: ${project.featured || false}
github: "${project.github || ''}"
link: "${project.link || ''}"
---

${project.description}`;

  writeFileSync(filepath, frontMatter);
}