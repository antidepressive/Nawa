import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema, insertNewsletterSubscriptionSchema, insertWorkshopRegistrationSchema } from "@shared/schema";
import { db } from "./db";
import { sql } from "drizzle-orm";
import { requireDeveloperAuth, requireDeveloperAuthQuery, requireDeleteAuthQuery } from "./auth";
import { emailService, createWorkshopConfirmationEmail } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {

   // Health check endpoint (developer access only)
  app.get("/api/health", requireDeveloperAuthQuery, async (req, res) => {
    try {
      // Test database connection
      await db.execute(sql`SELECT 1`);
      
      // Test SMTP connection
      const smtpConnected = await emailService.testConnection();
      
      res.json({ 
        status: "healthy", 
        database: "connected",
        smtp: smtpConnected ? "connected" : "disconnected",
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
  app.post("/api/contact", async (req, res) => {
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
  app.post("/api/newsletter", async (req, res) => {
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

  // Workshop registration
  app.post("/api/workshop", async (req, res) => {
    try {
      const validation = insertWorkshopRegistrationSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid form data", details: validation.error.errors });
      }

      const registration = await storage.createWorkshopRegistration(validation.data);
      console.log(`New workshop registration from ${registration.name} (${registration.email})`);
      
      // Send confirmation email
      try {
        const emailSent = await emailService.sendWorkshopConfirmation(registration);
        if (emailSent) {
          console.log(`Confirmation email sent to ${registration.email}`);
        } else {
          console.warn(`Failed to send confirmation email to ${registration.email}`);
        }
      } catch (emailError) {
        console.error(`Error sending confirmation email: ${emailError}`);
        // Don't fail the registration if email fails
      }
      
      res.json({ success: true, message: "Workshop registration submitted successfully" });
    } catch (error) {
      console.error(`Error processing workshop registration: ${error}`);
      res.status(500).json({ error: "Failed to submit workshop registration" });
    }
  });

  // Get workshop registrations (for admin use)
  app.get("/api/workshop", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const registrations = await storage.getWorkshopRegistrations();
      res.json(registrations);
    } catch (error) {
      console.error(`Error fetching workshop registrations: ${error}`);
      res.status(500).json({ error: "Failed to fetch workshop registrations" });
    }
  });

  // Delete single contact submission (for admin use)
  app.delete("/api/contact/:id", requireDeleteAuthQuery, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const deleted = await storage.deleteContactSubmission(id);
      if (deleted) {
        res.json({ success: true, message: "Contact submission deleted successfully" });
      } else {
        res.status(404).json({ error: "Contact submission not found" });
      }
    } catch (error) {
      console.error(`Error deleting contact submission: ${error}`);
      res.status(500).json({ error: "Failed to delete contact submission" });
    }
  });

  // Delete multiple contact submissions (for admin use)
  app.delete("/api/contact", requireDeleteAuthQuery, async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "Invalid IDs array" });
      }

      const deletedCount = await storage.deleteContactSubmissions(ids);
      res.json({ 
        success: true, 
        message: `${deletedCount} contact submission(s) deleted successfully`,
        deletedCount 
      });
    } catch (error) {
      console.error(`Error deleting contact submissions: ${error}`);
      res.status(500).json({ error: "Failed to delete contact submissions" });
    }
  });

  // Delete single newsletter subscription (for admin use)
  app.delete("/api/newsletter/:id", requireDeleteAuthQuery, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const deleted = await storage.deleteNewsletterSubscription(id);
      if (deleted) {
        res.json({ success: true, message: "Newsletter subscription deleted successfully" });
      } else {
        res.status(404).json({ error: "Newsletter subscription not found" });
      }
    } catch (error) {
      console.error(`Error deleting newsletter subscription: ${error}`);
      res.status(500).json({ error: "Failed to delete newsletter subscription" });
    }
  });

  // Delete multiple newsletter subscriptions (for admin use)
  app.delete("/api/newsletter", requireDeleteAuthQuery, async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "Invalid IDs array" });
      }

      const deletedCount = await storage.deleteNewsletterSubscriptions(ids);
      res.json({ 
        success: true, 
        message: `${deletedCount} newsletter subscription(s) deleted successfully`,
        deletedCount 
      });
    } catch (error) {
      console.error(`Error deleting newsletter subscriptions: ${error}`);
      res.status(500).json({ error: "Failed to delete newsletter subscriptions" });
    }
  });

  // Delete single workshop registration (for admin use)
  app.delete("/api/workshop/:id", requireDeleteAuthQuery, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const deleted = await storage.deleteWorkshopRegistration(id);
      if (deleted) {
        res.json({ success: true, message: "Workshop registration deleted successfully" });
      } else {
        res.status(404).json({ error: "Workshop registration not found" });
      }
    } catch (error) {
      console.error(`Error deleting workshop registration: ${error}`);
      res.status(500).json({ error: "Failed to delete workshop registration" });
    }
  });

  // Delete multiple workshop registrations (for admin use)
  app.delete("/api/workshop", requireDeleteAuthQuery, async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "Invalid IDs array" });
      }

      const deletedCount = await storage.deleteWorkshopRegistrations(ids);
      res.json({ 
        success: true, 
        message: `${deletedCount} workshop registration(s) deleted successfully`,
        deletedCount 
      });
    } catch (error) {
      console.error(`Error deleting workshop registrations: ${error}`);
      res.status(500).json({ error: "Failed to delete workshop registrations" });
    }
  });

  // Preview email template (developer access only)
  app.get("/api/preview-email", requireDeveloperAuthQuery, async (req, res) => {
    try {
      // Create a sample registration for preview
      const sampleRegistration = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "+966501234567",
        payment: "venue",
        bundle: "199",
        friend1Name: "Jane Smith",
        friend1Email: "jane@example.com",
        friend1Phone: "+966501234568",
        friend2Name: "Mike Johnson",
        friend2Email: "mike@example.com",
        friend2Phone: "+966501234569",
        createdAt: new Date()
      };

      const emailContent = createWorkshopConfirmationEmail(sampleRegistration);
      
      res.setHeader('Content-Type', 'text/html');
      res.send(emailContent.html);
    } catch (error) {
      console.error(`Error generating email preview: ${error}`);
      res.status(500).json({ error: "Failed to generate email preview" });
    }
  });

  // Serve NAWA background image (developer access only)
  app.get("/api/assets/nawa-background", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const imagePath = './attached_assets/nawa-background.webp';
      
      // Check if file exists
      const fs = await import('fs');
      if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ error: "Background image not found" });
      }

      // Set appropriate headers
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      // Stream the image
      const stream = fs.createReadStream(imagePath);
      stream.pipe(res);
    } catch (error) {
      console.error(`Error serving background image: ${error}`);
      res.status(500).json({ error: "Failed to serve background image" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
