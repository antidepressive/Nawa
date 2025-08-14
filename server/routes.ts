import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSubmissionSchema, 
  insertNewsletterSubscriptionSchema, 
  insertWorkshopRegistrationSchema,
  insertAccountSchema,
  insertCategorySchema,
  insertTransactionSchema,
  insertBudgetSchema,
  insertUserSettingsSchema
} from "@shared/schema";
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

  // Finance Dashboard API Endpoints (developer access only)
  
  // Accounts
  app.get("/api/finance/accounts", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const accounts = await storage.getAccounts();
      res.json(accounts);
    } catch (error) {
      console.error(`Error fetching accounts: ${error}`);
      res.status(500).json({ error: "Failed to fetch accounts" });
    }
  });

  app.post("/api/finance/accounts", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const validation = insertAccountSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid account data", details: validation.error.errors });
      }

      const account = await storage.createAccount(validation.data);
      res.json(account);
    } catch (error) {
      console.error(`Error creating account: ${error}`);
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  app.put("/api/finance/accounts/:id", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const account = await storage.updateAccount(id, req.body);
      if (account) {
        res.json(account);
      } else {
        res.status(404).json({ error: "Account not found" });
      }
    } catch (error) {
      console.error(`Error updating account: ${error}`);
      res.status(500).json({ error: "Failed to update account" });
    }
  });

  app.delete("/api/finance/accounts/:id", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const deleted = await storage.deleteAccount(id);
      if (deleted) {
        res.json({ success: true, message: "Account deleted successfully" });
      } else {
        res.status(404).json({ error: "Account not found" });
      }
    } catch (error) {
      console.error(`Error deleting account: ${error}`);
      res.status(500).json({ error: "Failed to delete account" });
    }
  });

  // Categories
  app.get("/api/finance/categories", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error(`Error fetching categories: ${error}`);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/finance/categories", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const validation = insertCategorySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid category data", details: validation.error.errors });
      }

      const category = await storage.createCategory(validation.data);
      res.json(category);
    } catch (error) {
      console.error(`Error creating category: ${error}`);
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.put("/api/finance/categories/:id", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const category = await storage.updateCategory(id, req.body);
      if (category) {
        res.json(category);
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      console.error(`Error updating category: ${error}`);
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/finance/categories/:id", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const deleted = await storage.deleteCategory(id);
      if (deleted) {
        res.json({ success: true, message: "Category deleted successfully" });
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      console.error(`Error deleting category: ${error}`);
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Transactions
  app.get("/api/finance/transactions", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const transactions = await storage.getTransactions();
      res.json(transactions);
    } catch (error) {
      console.error(`Error fetching transactions: ${error}`);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/finance/transactions", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const validation = insertTransactionSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid transaction data", details: validation.error.errors });
      }

      const transaction = await storage.createTransaction(validation.data);
      res.json(transaction);
    } catch (error) {
      console.error(`Error creating transaction: ${error}`);
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  app.put("/api/finance/transactions/:id", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const transaction = await storage.updateTransaction(id, req.body);
      if (transaction) {
        res.json(transaction);
      } else {
        res.status(404).json({ error: "Transaction not found" });
      }
    } catch (error) {
      console.error(`Error updating transaction: ${error}`);
      res.status(500).json({ error: "Failed to update transaction" });
    }
  });

  app.delete("/api/finance/transactions/:id", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const deleted = await storage.deleteTransaction(id);
      if (deleted) {
        res.json({ success: true, message: "Transaction deleted successfully" });
      } else {
        res.status(404).json({ error: "Transaction not found" });
      }
    } catch (error) {
      console.error(`Error deleting transaction: ${error}`);
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  });

  app.delete("/api/finance/transactions", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "Invalid IDs array" });
      }

      const deletedCount = await storage.deleteTransactions(ids);
      res.json({ 
        success: true, 
        message: `${deletedCount} transaction(s) deleted successfully`,
        deletedCount 
      });
    } catch (error) {
      console.error(`Error deleting transactions: ${error}`);
      res.status(500).json({ error: "Failed to delete transactions" });
    }
  });

  // Budgets
  app.get("/api/finance/budgets", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const budgets = await storage.getBudgets();
      res.json(budgets);
    } catch (error) {
      console.error(`Error fetching budgets: ${error}`);
      res.status(500).json({ error: "Failed to fetch budgets" });
    }
  });

  app.post("/api/finance/budgets", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const validation = insertBudgetSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid budget data", details: validation.error.errors });
      }

      const budget = await storage.createBudget(validation.data);
      res.json(budget);
    } catch (error) {
      console.error(`Error creating budget: ${error}`);
      res.status(500).json({ error: "Failed to create budget" });
    }
  });

  app.put("/api/finance/budgets/:id", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const budget = await storage.updateBudget(id, req.body);
      if (budget) {
        res.json(budget);
      } else {
        res.status(404).json({ error: "Budget not found" });
      }
    } catch (error) {
      console.error(`Error updating budget: ${error}`);
      res.status(500).json({ error: "Failed to update budget" });
    }
  });

  app.delete("/api/finance/budgets/:id", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const deleted = await storage.deleteBudget(id);
      if (deleted) {
        res.json({ success: true, message: "Budget deleted successfully" });
      } else {
        res.status(404).json({ error: "Budget not found" });
      }
    } catch (error) {
      console.error(`Error deleting budget: ${error}`);
      res.status(500).json({ error: "Failed to delete budget" });
    }
  });

  // User Settings
  app.get("/api/finance/settings/:userId", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const settings = await storage.getUserSettings(userId);
      if (settings) {
        res.json(settings);
      } else {
        res.status(404).json({ error: "User settings not found" });
      }
    } catch (error) {
      console.error(`Error fetching user settings: ${error}`);
      res.status(500).json({ error: "Failed to fetch user settings" });
    }
  });

  app.post("/api/finance/settings", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const validation = insertUserSettingsSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid settings data", details: validation.error.errors });
      }

      const settings = await storage.createUserSettings(validation.data);
      res.json(settings);
    } catch (error) {
      console.error(`Error creating user settings: ${error}`);
      res.status(500).json({ error: "Failed to create user settings" });
    }
  });

  app.put("/api/finance/settings/:userId", requireDeveloperAuthQuery, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const settings = await storage.updateUserSettings(userId, req.body);
      if (settings) {
        res.json(settings);
      } else {
        res.status(404).json({ error: "User settings not found" });
      }
    } catch (error) {
      console.error(`Error updating user settings: ${error}`);
      res.status(500).json({ error: "Failed to update user settings" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
