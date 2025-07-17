import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostSchema, insertProjectSchema, insertContactSchema } from "@shared/schema";
import { emailService } from "./email-service";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Initialize email service
  await emailService.initialize();
  
  // Posts endpoints
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/featured", async (req, res) => {
    try {
      const posts = await storage.getFeaturedPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured posts" });
    }
  });

  app.get("/api/posts/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const posts = await storage.searchPosts(query);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to search posts" });
    }
  });

  app.get("/api/posts/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const posts = await storage.getPostsByCategory(category);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts by category" });
    }
  });

  app.get("/api/posts/tag/:tag", async (req, res) => {
    try {
      const { tag } = req.params;
      const posts = await storage.getPostsByTag(tag);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts by tag" });
    }
  });

// Posts routes
  app.get("/api/posts/:slug", async (req, res) => {
    console.log(`GET /api/posts/${req.params.slug} called`);
    try {
      const { slug } = req.params;
      const post = await storage.getPost(slug);
      if (!post) {
        console.log(`Post not found: ${slug}`);
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });  app.post("/api/posts", async (req, res) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(postData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  // Projects endpoints
  app.get("/api/projects", async (req, res) => {
    console.log('GET /api/projects called');
    try {
      const projects = await storage.getProjects();
      console.log(`Returning ${projects.length} projects`);
      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/featured", async (req, res) => {
    try {
      const projects = await storage.getFeaturedProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured projects" });
    }
  });

  app.get("/api/projects/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const project = await storage.getProject(slug);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Creatives endpoints
  app.get("/api/creatives", async (req, res) => {
    console.log('GET /api/creatives called');
    try {
      const creatives = await storage.getCreatives();
      console.log(`Returning ${creatives.length} creatives`);
      res.json(creatives);
    } catch (error) {
      console.error('Error fetching creatives:', error);
      res.status(500).json({ message: "Failed to fetch creatives" });
    }
  });

  app.get("/api/creatives/featured", async (req, res) => {
    try {
      const creatives = await storage.getFeaturedCreatives();
      res.json(creatives);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured creatives" });
    }
  });

  app.get("/api/creatives/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const creative = await storage.getCreative(slug);
      if (!creative) {
        return res.status(404).json({ message: "Creative not found" });
      }
      res.json(creative);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch creative" });
    }
  });

  // Contact endpoints
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      
      // Store the contact in the database
      const contact = await storage.createContact(contactData);
      
      // Try to send email notification
      try {
        const emailSent = await emailService.sendContactEmail(contactData);
        if (emailSent) {
          console.log('Contact email sent successfully');
        }
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the request if email fails - the contact is still stored
      }
      
      res.status(201).json({ 
        ...contact, 
        emailSent: emailService.isInitialized() 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  // Content refresh endpoint
  app.post("/api/refresh", async (req, res) => {
    try {
      await storage.refreshContent();
      res.json({ 
        message: "Content refreshed successfully",
        timestamp: new Date().toISOString() 
      });
    } catch (error) {
      console.error('Error refreshing content:', error);
      res.status(500).json({ message: "Failed to refresh content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
