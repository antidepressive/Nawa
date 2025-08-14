import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { initializeDefaultData } from '../../lib/financeApi';

interface AuthGateProps {
  children: React.ReactNode;
}

const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Check if already authenticated on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('finance_dashboard_auth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async () => {
    // Use the actual DEVELOPER_TOKEN environment variable
    const developerToken = process.env.DEVELOPER_TOKEN || 'dev123';
    
    if (password === developerToken) {
      setIsAuthenticated(true);
      localStorage.setItem('finance_dashboard_auth', 'authenticated');
      localStorage.setItem('finance_dashboard_token', developerToken);
      setError('');
      
      // Initialize default data for first-time users
      try {
        await initializeDefaultData();
      } catch (error) {
        console.error('Error initializing default data:', error);
      }
    } else {
      setError('Incorrect developer token. Please try again.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('finance_dashboard_auth');
    localStorage.removeItem('finance_dashboard_token');
    setPassword('');
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  if (isAuthenticated) {
    return (
      <div>
        <div className="flex justify-end p-4">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Finance Dashboard</CardTitle>
          <p className="text-muted-foreground">Developer Token Required</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Developer Token</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter developer token"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          
          <Button 
            onClick={() => handleLogin()} 
            className="w-full"
            disabled={!password.trim()}
          >
            Access Dashboard
          </Button>
          
          <div className="text-xs text-muted-foreground text-center">
            <p>Developer token required for access</p>
            <p className="mt-1">Contact the development team for the token</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthGate;
