import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostSchema, insertProjectSchema, insertContactSchema } from "@shared/schema";
import { emailService } from "./email-service";
import { checkRateLimit, getClientIP, validateContactData, detectSpam } from "./security";
import { z } from "zod";
import { createClient } from '@supabase/supabase-js';

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Initialize email service
  await emailService.initialize();
  
  // Posts endpoints
  app.get("/api/posts", async (req, res) => {
    try {
      const featuredOnly = req.query.featured === 'true';
      const posts = featuredOnly ? await storage.getFeaturedPosts() : await storage.getPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
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

  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const results = await storage.searchAll(query);
      
      // Flatten the results to match the Vercel API format
      const flatResults = [
        ...results.posts.map(post => ({ ...post, type: 'post' })),
        ...results.projects.map(project => ({ ...project, type: 'project' })),
        ...results.creatives.map(creative => ({ ...creative, type: 'creative' }))
      ];
      
      res.json(flatResults);
    } catch (error) {
      res.status(500).json({ message: "Failed to perform search" });
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
      const featuredOnly = req.query.featured === 'true';
      const projects = featuredOnly ? await storage.getFeaturedProjects() : await storage.getProjects();
      console.log(`Returning ${projects.length} projects`);
      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: "Failed to fetch projects" });
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

  // Contact endpoints (handles both contact form and comments)
  app.post("/api/contact", async (req, res) => {
    try {
      const { type, honeypot } = req.body;

      // Route to comment handler if type is 'comment'
      if (type === 'comment') {
        // Honeypot check for comments
        if (honeypot) {
          return res.status(200).json({ message: 'Comment submitted successfully' });
        }

        const { name, email, message, postSlug, postType } = req.body;

        // Basic validation for comments
        if (!name || !email || !message || !postSlug || !postType) {
          return res.status(400).json({ message: 'All fields are required' });
        }

        // Initialize Supabase client
        const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          console.error('Supabase credentials not configured');
          return res.status(500).json({ message: 'Comments are not configured' });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Insert comment into Supabase
        const { data: insertData, error: insertError } = await supabase.from('comments').insert({
          post_slug: postSlug,
          post_type: postType,
          author_name: name.trim(),
          author_email: email.trim(),
          content: message.trim(),
          status: 'approved',
          website: '',
        }).select();

        if (insertError) {
          console.error('Error inserting comment:', insertError);
          return res.status(500).json({ message: 'Failed to submit comment' });
        }

        // Send email notification for comment
        try {
          await emailService.sendCommentNotification({
            postSlug,
            postType,
            authorName: name.trim(),
            authorEmail: email.trim(),
            content: message.trim(),
          });
        } catch (emailError) {
          console.error('Failed to send comment email notification:', emailError);
        }

        return res.status(201).json({ message: 'Comment submitted successfully' });
      }

      // Original contact form handling below
      // Get client IP for rate limiting
      const clientIP = getClientIP(req);

      // Check rate limit
      const rateLimit = checkRateLimit(clientIP);
      if (!rateLimit.allowed) {
        const resetTime = new Date(rateLimit.resetTime!);
        return res.status(429).json({
          message: "Too many requests. Please try again later.",
          resetTime: resetTime.toISOString()
        });
      }

      // Validate and sanitize input
      const validation = validateContactData(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          message: "Invalid input",
          errors: validation.errors
        });
      }

      const sanitizedData = validation.sanitizedData!;

      // Check for spam
      if (detectSpam(sanitizedData)) {
        console.warn(`Potential spam detected from IP ${clientIP}:`, sanitizedData);
        return res.status(400).json({ 
          message: "Message appears to be spam. Please try again with a different message." 
        });
      }

      // Validate with Zod schema (additional validation)
      const contactData = insertContactSchema.parse(sanitizedData);
      
      // Store the contact in the database
      const contact = await storage.createContact(contactData);
      
      // Try to send email notification
      let emailSent = false;
      try {
        emailSent = await emailService.sendContactEmail(contactData);
        if (emailSent) {
          console.log(`Contact email sent successfully from ${contactData.email} (IP: ${clientIP})`);
        }
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the request if email fails - the contact is still stored
      }
      
      res.status(201).json({ 
        ...contact, 
        emailSent,
        remainingRequests: rateLimit.remainingRequests
      });
    } catch (error) {
      console.error('Contact form submission error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid contact data", 
          errors: error.errors.map(e => e.message)
        });
      }
      
      res.status(500).json({ 
        message: "Failed to submit contact form. Please try again later." 
      });
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
