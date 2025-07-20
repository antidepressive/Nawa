import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema, insertNewsletterSubscriptionSchema } from "@shared/schema";
import { db } from "./db";
import { sql } from "drizzle-orm";
import { requireDeveloperAuth, requireDeveloperAuthQuery } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {

   // Health check endpoint (developer access only)
  app.get("/api/health", requireDeveloperAuthQuery, async (req, res) => {
    try {
      // Test database connection
      await db.execute(sql`SELECT 1`);
      res.json({ 
        status: "healthy", 
        database: "connected",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        status: "unhealthy", 
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      });
    }
  });
  // Contact form submission
  app.post("/api/contact", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const validation = insertContactSubmissionSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid form data", details: validation.error.errors });
      }

      const submission = await storage.createContactSubmission(validation.data);
      console.log(`New contact submission from ${submission.email}`);
      
      res.json({ success: true, message: "Contact form submitted successfully" });
    } catch (error) {
      console.error(`Error processing contact submission: ${error}`);
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter", requireDeveloperAuthQuery, async (req, res) => {
    try {
      console.log("Newsletter subscription request received:", req.body);
      
      const validation = insertNewsletterSubscriptionSchema.safeParse(req.body);
      
      if (!validation.success) {
        console.error("Validation failed:", validation.error.errors);
        return res.status(400).json({ error: "Invalid email address", details: validation.error.errors });
      }

      console.log("Validation passed, creating subscription...");
      const subscription = await storage.createNewsletterSubscription(validation.data);
      console.log(`New newsletter subscription: ${subscription.email}`);
      
      res.json({ success: true, message: "Successfully subscribed to newsletter" });
    } catch (error) {
      console.error(`Error processing newsletter subscription:`, error);
      // Log more details about the error
      if (error instanceof Error) {
        console.error(`Error message: ${error.message}`);
        console.error(`Error stack: ${error.stack}`);
      }
      res.status(500).json({ error: "Failed to subscribe to newsletter" });
    }
  });

  // Get contact submissions (for admin use)
  app.get("/api/contact", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error(`Error fetching contact submissions: ${error}`);
      res.status(500).json({ error: "Failed to fetch contact submissions" });
    }
  });

  // Get newsletter subscriptions (for admin use)
  app.get("/api/newsletter", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const subscriptions = await storage.getNewsletterSubscriptions();
      res.json(subscriptions);
    } catch (error) {
      console.error(`Error fetching newsletter subscriptions: ${error}`);
      res.status(500).json({ error: "Failed to fetch newsletter subscriptions" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
