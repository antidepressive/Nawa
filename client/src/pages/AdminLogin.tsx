import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { useLocation } from 'wouter';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast({
        title: language === 'ar' ? 'خطأ في الإدخال' : 'Input Error',
        description: language === 'ar' ? 'يرجى إدخال كلمة المرور' : 'Please enter the password',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      // Test the password by making a request to a protected endpoint
      const response = await fetch('/api/health?apiKey=' + encodeURIComponent(password));
      
      if (response.ok) {
        // Store the token in sessionStorage
        sessionStorage.setItem('adminToken', password);
        toast({
          title: language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Login Successful',
          description: language === 'ar' ? 'مرحباً بك في لوحة الإدارة' : 'Welcome to the admin dashboard',
        });
        setLocation('/admin');
      } else {
        toast({
          title: language === 'ar' ? 'خطأ في تسجيل الدخول' : 'Login Failed',
          description: language === 'ar' ? 'كلمة المرور غير صحيحة' : 'Incorrect password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: language === 'ar' ? 'خطأ في الاتصال' : 'Connection Error',
        description: language === 'ar' ? 'فشل في الاتصال بالخادم' : 'Failed to connect to server',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className={`mt-6 text-3xl font-bold text-gray-900 ${language === 'ar' ? 'font-cairo' : 'font-montserrat'}`}>
            {language === 'ar' ? 'تسجيل دخول الإدارة' : 'Admin Login'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {language === 'ar' ? 'أدخل كلمة المرور للوصول إلى لوحة الإدارة' : 'Enter password to access admin dashboard'}
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="password" className={language === 'ar' ? 'text-right' : 'text-left'}>
                  {language === 'ar' ? 'كلمة المرور' : 'Password'}
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pr-10 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                    placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading 
                  ? (language === 'ar' ? 'جاري تسجيل الدخول...' : 'Logging in...')
                  : (language === 'ar' ? 'تسجيل الدخول' : 'Login')
                }
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 