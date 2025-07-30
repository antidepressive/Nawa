import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { db } from "./db";
import { sql } from "drizzle-orm";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Function to create database tables if they don't exist
async function ensureTablesExist() {
  const maxRetries = 3;
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      log(`Checking database tables... (attempt ${attempt}/${maxRetries})`);
      
      // Test connection first
      await db.execute(sql`SELECT 1`);
      
      // Create newsletter_subscriptions table if it doesn't exist
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
        )
      `);
      
      // Create contact_submissions table if it doesn't exist
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS contact_submissions (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          organization TEXT,
          email TEXT NOT NULL,
          phone TEXT,
          interest TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
        )
      `);
      
      // Create users table if it doesn't exist
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        )
      `);
      
      // Create workshop_registrations table if it doesn't exist
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS workshop_registrations (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          payment TEXT NOT NULL,
          bundle TEXT NOT NULL,
          friend1_name TEXT,
          friend1_email TEXT,
          friend1_phone TEXT,
          friend2_name TEXT,
          friend2_email TEXT,
          friend2_phone TEXT,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
        )
      `);
      
      log("Database tables are ready");
      return; // Success, exit the retry loop
    } catch (error) {
      lastError = error;
      log(`Database setup attempt ${attempt} failed: ${error}`);
      
      if (attempt < maxRetries) {
        log(`Retrying in 2 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  
  // If we get here, all attempts failed
  throw lastError;
}

(async () => {
  // Try to ensure database tables exist, but don't fail if it doesn't work
  try {
    await ensureTablesExist();
  } catch (error) {
    log("Database setup failed, but continuing with app startup");
    log(`Database error: ${error}`);
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
