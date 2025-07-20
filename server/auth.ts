import { Request, Response, NextFunction } from 'express';

// Simple authentication middleware for developer access
export function requireDeveloperAuth(req: Request, res: Response, next: NextFunction) {
  // Get authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Developer authentication required' 
    });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.substring(7);
  
  // Check against environment variable
  const expectedToken = process.env.DEVELOPER_TOKEN;
  
  if (!expectedToken) {
    console.error('DEVELOPER_TOKEN environment variable not set');
    return res.status(500).json({ 
      error: 'Server configuration error',
      message: 'Developer authentication not configured' 
    });
  }

  if (token !== expectedToken) {
    return res.status(403).json({ 
      error: 'Forbidden', 
      message: 'Invalid developer token' 
    });
  }

  // Authentication successful
  next();
}

// Alternative authentication using API key in query parameter (for easier testing)
export function requireDeveloperAuthQuery(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.query.apiKey as string;
  
  if (!apiKey) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Developer API key required. Add ?apiKey=your_token to the URL' 
    });
  }

  const expectedToken = process.env.DEVELOPER_TOKEN;
  
  if (!expectedToken) {
    console.error('DEVELOPER_TOKEN environment variable not set');
    return res.status(500).json({ 
      error: 'Server configuration error',
      message: 'Developer authentication not configured' 
    });
  }

  if (apiKey !== expectedToken) {
    return res.status(403).json({ 
      error: 'Forbidden', 
      message: 'Invalid developer API key' 
    });
  }

  // Authentication successful
  next();
} 
