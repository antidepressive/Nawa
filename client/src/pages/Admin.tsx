import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Trash2, Download, RefreshCw, AlertTriangle, LogOut, Shield, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useLocation } from 'wouter';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

interface NewsletterSubscription {
  id: number;
  email: string;
  createdAt: string;
}

interface WorkshopRegistration {
  id: number;
  name: string;
  email: string;
  phone: string;
  payment: string;
  bundle: string;
  friend1Name?: string;
  friend1Email?: string;
  friend1Phone?: string;
  friend2Name?: string;
  friend2Email?: string;
  friend2Phone?: string;
  createdAt: string;
}

interface JobApplication {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  workExperience: string;
  education: string;
  skills: string;
  resumePath: string;
  status: string;
  createdAt: string;
}

interface LeadershipWorkshopRegistration {
  id: number;
  name: string;
  email: string;
  phone: string;
  payment: string;
  transactionProof: string | null;
  createdAt: string;
}

// Helper function to make authenticated API requests
const apiRequest = async (method: string, endpoint: string, data?: any, token?: string) => {
  const authToken = token || sessionStorage.getItem('adminToken');
  if (!authToken) {
    throw new Error('No authentication token');
  }

  const url = endpoint.includes('?') 
    ? `${endpoint}&apiKey=${encodeURIComponent(authToken)}`
    : `${endpoint}?apiKey=${encodeURIComponent(authToken)}`;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Clear invalid token and redirect to login
      sessionStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
      throw new Error('Authentication failed');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export default function Admin() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [newsletterSubscriptions, setNewsletterSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [workshopRegistrations, setWorkshopRegistrations] = useState<WorkshopRegistration[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [leadershipWorkshopRegistrations, setLeadershipWorkshopRegistrations] = useState<LeadershipWorkshopRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<{
    contacts: number[];
    newsletters: number[];
    workshops: number[];
    applications: number[];
    leadershipWorkshops: number[];
  }>({ contacts: [], newsletters: [], workshops: [], applications: [], leadershipWorkshops: [] });

  // Sorting state
  const [sortOrder, setSortOrder] = useState<{
    contacts: 'newest' | 'oldest';
    newsletters: 'newest' | 'oldest';
    workshops: 'newest' | 'oldest';
    applications: 'newest' | 'oldest';
    leadershipWorkshops: 'newest' | 'oldest';
  }>({
    contacts: 'newest',
    newsletters: 'newest',
    workshops: 'newest',
    applications: 'newest',
    leadershipWorkshops: 'newest'
  });

  // Delete confirmation dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteType, setDeleteType] = useState<'contacts' | 'newsletters' | 'workshops' | 'applications' | 'leadershipWorkshops' | null>(null);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);
  const [deleteToken, setDeleteToken] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = sessionStorage.getItem('adminToken');
    if (!token) {
      setLocation('/admin/login');
      return;
    }

    document.title = 'Admin Dashboard - نَوَاة';
    fetchData();
  }, [setLocation]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setLocation('/admin/login');
    toast({
      title: language === 'ar' ? 'تم تسجيل الخروج' : 'Logged Out',
      description: language === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Successfully logged out',
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [contacts, newsletters, workshops, applications, leadershipWorkshops] = await Promise.all([
        apiRequest('GET', '/api/contact'),
        apiRequest('GET', '/api/newsletter'),
        apiRequest('GET', '/api/workshop'),
        apiRequest('GET', '/api/job-applications'),
        apiRequest('GET', '/api/leadership-workshop')
      ]);
      
      setContactSubmissions(contacts);
      setNewsletterSubscriptions(newsletters);
      setWorkshopRegistrations(workshops);
      setJobApplications(applications);
      setLeadershipWorkshopRegistrations(leadershipWorkshops);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error instanceof Error && error.message === 'Authentication failed') {
        return; // Already redirected to login
      }
      toast({
        title: language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data',
        description: language === 'ar' ? 'فشل في تحميل البيانات من الخادم' : 'Failed to load data from server',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (type: 'contacts' | 'newsletters' | 'workshops' | 'applications' | 'leadershipWorkshops', ids: number[]) => {
    if (ids.length === 0) return;
    
    setDeleteType(type);
    setDeleteIds(ids);
    setDeleteToken('');
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteType || deleteIds.length === 0 || !deleteToken.trim()) {
      toast({
        title: language === 'ar' ? 'خطأ في الإدخال' : 'Input Error',
        description: language === 'ar' ? 'يرجى إدخال رمز الحذف' : 'Please enter the delete token',
        variant: 'destructive',
      });
      return;
    }

    setDeleteLoading(true);
    
    try {
      const endpoint = deleteType === 'contacts' ? '/api/contact' : 
                      deleteType === 'newsletters' ? '/api/newsletter' : 
                      deleteType === 'workshops' ? '/api/workshop' : 
                      deleteType === 'leadershipWorkshops' ? '/api/leadership-workshop' : '/api/job-applications';
      
      const response = await apiRequest('DELETE', endpoint, { ids: deleteIds }, deleteToken);
      
      if (response.success) {
        toast({
          title: language === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully',
          description: response.message,
        });
        
        // Refresh data
        fetchData();
        
        // Clear selections
        setSelectedItems(prev => ({ ...prev, [deleteType]: [] }));
        
        // Close dialog
        setShowDeleteDialog(false);
        setDeleteType(null);
        setDeleteIds([]);
        setDeleteToken('');
      }
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error);
      if (error instanceof Error && error.message === 'Authentication failed') {
        return; // Already redirected to login
      }
      toast({
        title: language === 'ar' ? 'خطأ في الحذف' : 'Delete error',
        description: language === 'ar' ? 'فشل في حذف العناصر المحددة' : 'Failed to delete selected items',
        variant: 'destructive',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSelectItem = (type: 'contacts' | 'newsletters' | 'workshops' | 'applications' | 'leadershipWorkshops', id: number) => {
    setSelectedItems(prev => {
      const current = prev[type];
      const newSelection = current.includes(id) 
        ? current.filter(item => item !== id)
        : [...current, id];
      return { ...prev, [type]: newSelection };
    });
  };

  const handleSelectAll = (type: 'contacts' | 'newsletters' | 'workshops' | 'applications' | 'leadershipWorkshops') => {
    const items = type === 'contacts' ? contactSubmissions : 
                  type === 'newsletters' ? newsletterSubscriptions : 
                  type === 'workshops' ? workshopRegistrations : 
                  type === 'leadershipWorkshops' ? leadershipWorkshopRegistrations : jobApplications;
    const allIds = items.map(item => item.id);
    setSelectedItems(prev => ({ ...prev, [type]: allIds }));
  };

  const handleClearSelection = (type: 'contacts' | 'newsletters' | 'workshops' | 'applications' | 'leadershipWorkshops') => {
    setSelectedItems(prev => ({ ...prev, [type]: [] }));
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getDeleteTypeLabel = (type: 'contacts' | 'newsletters' | 'workshops' | 'applications' | 'leadershipWorkshops') => {
    switch (type) {
      case 'contacts': return language === 'ar' ? 'طلبات الاتصال' : 'Contact submissions';
      case 'newsletters': return language === 'ar' ? 'اشتراكات النشرة الإخبارية' : 'Newsletter subscriptions';
      case 'workshops': return language === 'ar' ? 'تسجيلات ورش العمل' : 'Workshop registrations';
      case 'applications': return language === 'ar' ? 'طلبات التوظيف' : 'Job applications';
      case 'leadershipWorkshops': return language === 'ar' ? 'تسجيلات ورشة القيادة' : 'Leadership workshop registrations';
      default: return '';
    }
  };

  // Sort function
  const sortData = <T extends { createdAt: string }>(data: T[], order: 'newest' | 'oldest'): T[] => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return order === 'newest' ? dateB - dateA : dateA - dateB;
    });
  };

  // Get sorted data
  const getSortedContacts = () => sortData(contactSubmissions, sortOrder.contacts);
  const getSortedNewsletters = () => sortData(newsletterSubscriptions, sortOrder.newsletters);
  const getSortedWorkshops = () => sortData(workshopRegistrations, sortOrder.workshops);
  const getSortedApplications = () => sortData(jobApplications, sortOrder.applications);
  const getSortedLeadershipWorkshops = () => sortData(leadershipWorkshopRegistrations, sortOrder.leadershipWorkshops);

  // Handle sort change
  const handleSortChange = (type: 'contacts' | 'newsletters' | 'workshops' | 'applications' | 'leadershipWorkshops') => {
    setSortOrder((prev: typeof sortOrder) => ({
      ...prev,
      [type]: prev[type] === 'newest' ? 'oldest' : 'newest'
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${language === 'ar' ? 'font-cairo text-right' : 'font-montserrat'}`}>
              {language === 'ar' ? 'لوحة الإدارة' : 'Admin Dashboard'}
            </h1>
            <p className="text-gray-600">
              {language === 'ar' ? 'إدارة الطلبات والاشتراكات' : 'Manage submissions and subscriptions'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
          </Button>
        </div>

        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="contacts">
              {language === 'ar' ? 'طلبات الاتصال' : 'Contact'} ({contactSubmissions.length})
            </TabsTrigger>
            <TabsTrigger value="newsletters">
              {language === 'ar' ? 'النشرة الإخبارية' : 'Newsletter'} ({newsletterSubscriptions.length})
            </TabsTrigger>
            <TabsTrigger value="workshops">
              {language === 'ar' ? 'ورش العمل' : 'Workshops'} ({workshopRegistrations.length})
            </TabsTrigger>
            <TabsTrigger value="leadershipWorkshops">
              {language === 'ar' ? 'ورشة القيادة' : 'Leadership Workshop'} ({leadershipWorkshopRegistrations.length})
            </TabsTrigger>
            <TabsTrigger value="applications">
              {language === 'ar' ? 'طلبات التوظيف' : 'Job Applications'} ({jobApplications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('contacts')}
                >
                  {language === 'ar' ? 'تحديد الكل' : 'Select All'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleClearSelection('contacts')}
                >
                  {language === 'ar' ? 'إلغاء التحديد' : 'Clear'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSortChange('contacts')}
                  className="flex items-center gap-1"
                >
                  {sortOrder.contacts === 'newest' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                  {language === 'ar' 
                    ? (sortOrder.contacts === 'newest' ? 'الأحدث' : 'الأقدم')
                    : (sortOrder.contacts === 'newest' ? 'Newest' : 'Oldest')
                  }
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV(contactSubmissions, 'contact-submissions.csv')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'تصدير' : 'Export'}
                </Button>
                {selectedItems.contacts.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick('contacts', selectedItems.contacts)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {language === 'ar' ? `حذف (${selectedItems.contacts.length})` : `Delete (${selectedItems.contacts.length})`}
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-4">
              {getSortedContacts().map((submission) => (
                <Card key={submission.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="checkbox"
                            checked={selectedItems.contacts.includes(submission.id)}
                            onChange={() => handleSelectItem('contacts', submission.id)}
                            className="rounded"
                          />
                          <h3 className="font-semibold">{submission.name}</h3>
                          <Badge variant="secondary">{submission.email}</Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{submission.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(submission.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="newsletters" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('newsletters')}
                >
                  {language === 'ar' ? 'تحديد الكل' : 'Select All'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleClearSelection('newsletters')}
                >
                  {language === 'ar' ? 'إلغاء التحديد' : 'Clear'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSortChange('newsletters')}
                  className="flex items-center gap-1"
                >
                  {sortOrder.newsletters === 'newest' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                  {language === 'ar' 
                    ? (sortOrder.newsletters === 'newest' ? 'الأحدث' : 'الأقدم')
                    : (sortOrder.newsletters === 'newest' ? 'Newest' : 'Oldest')
                  }
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV(newsletterSubscriptions, 'newsletter-subscriptions.csv')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'تصدير' : 'Export'}
                </Button>
                {selectedItems.newsletters.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick('newsletters', selectedItems.newsletters)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {language === 'ar' ? `حذف (${selectedItems.newsletters.length})` : `Delete (${selectedItems.newsletters.length})`}
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-4">
              {getSortedNewsletters().map((subscription) => (
                <Card key={subscription.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedItems.newsletters.includes(subscription.id)}
                          onChange={() => handleSelectItem('newsletters', subscription.id)}
                          className="rounded"
                        />
                        <span className="font-medium">{subscription.email}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(subscription.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="workshops" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('workshops')}
                >
                  {language === 'ar' ? 'تحديد الكل' : 'Select All'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleClearSelection('workshops')}
                >
                  {language === 'ar' ? 'إلغاء التحديد' : 'Clear'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSortChange('workshops')}
                  className="flex items-center gap-1"
                >
                  {sortOrder.workshops === 'newest' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                  {language === 'ar' 
                    ? (sortOrder.workshops === 'newest' ? 'الأحدث' : 'الأقدم')
                    : (sortOrder.workshops === 'newest' ? 'Newest' : 'Oldest')
                  }
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV(workshopRegistrations, 'workshop-registrations.csv')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'تصدير' : 'Export'}
                </Button>
                {selectedItems.workshops.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick('workshops', selectedItems.workshops)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {language === 'ar' ? `حذف (${selectedItems.workshops.length})` : `Delete (${selectedItems.workshops.length})`}
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-4">
              {getSortedWorkshops().map((registration) => (
                <Card key={registration.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="checkbox"
                            checked={selectedItems.workshops.includes(registration.id)}
                            onChange={() => handleSelectItem('workshops', registration.id)}
                            className="rounded"
                          />
                          <h3 className="font-semibold">{registration.name}</h3>
                          <Badge variant="secondary">{registration.email}</Badge>
                          <Badge variant="outline">{registration.bundle} SAR</Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <p>Phone: {registration.phone}</p>
                          <p>Payment: {registration.payment}</p>
                          {registration.friend1Name && (
                            <p>Friends: {registration.friend1Name}, {registration.friend2Name}</p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(registration.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leadershipWorkshops" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('leadershipWorkshops')}
                >
                  {language === 'ar' ? 'تحديد الكل' : 'Select All'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleClearSelection('leadershipWorkshops')}
                >
                  {language === 'ar' ? 'إلغاء التحديد' : 'Clear'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSortChange('leadershipWorkshops')}
                  className="flex items-center gap-1"
                >
                  {sortOrder.leadershipWorkshops === 'newest' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                  {language === 'ar' 
                    ? (sortOrder.leadershipWorkshops === 'newest' ? 'الأحدث' : 'الأقدم')
                    : (sortOrder.leadershipWorkshops === 'newest' ? 'Newest' : 'Oldest')
                  }
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV(leadershipWorkshopRegistrations, 'leadership-workshop-registrations.csv')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'تصدير' : 'Export'}
                </Button>
                {selectedItems.leadershipWorkshops.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick('leadershipWorkshops', selectedItems.leadershipWorkshops)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {language === 'ar' ? `حذف (${selectedItems.leadershipWorkshops.length})` : `Delete (${selectedItems.leadershipWorkshops.length})`}
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-4">
              {getSortedLeadershipWorkshops().map((registration) => (
                <Card key={registration.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="checkbox"
                            checked={selectedItems.leadershipWorkshops.includes(registration.id)}
                            onChange={() => handleSelectItem('leadershipWorkshops', registration.id)}
                            className="rounded"
                          />
                          <h3 className="font-semibold">{registration.name}</h3>
                          <Badge variant="secondary">{registration.email}</Badge>
                          <Badge variant={registration.payment === 'iban' ? 'default' : 'outline'}>
                            {registration.payment === 'iban' 
                              ? (language === 'ar' ? 'تحويل بنكي' : 'Bank Transfer')
                              : (language === 'ar' ? 'دفع في المكان' : 'Pay at Venue')
                            }
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <p>{language === 'ar' ? 'الهاتف' : 'Phone'}: {registration.phone}</p>
                          <p>{language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}: {registration.payment === 'iban' 
                            ? (language === 'ar' ? 'تحويل بنكي (IBAN)' : 'Bank Transfer (IBAN)')
                            : (language === 'ar' ? 'الدفع في المكان' : 'Pay at Venue')
                          }</p>
                          {registration.transactionProof && (
                            <div className="flex items-center gap-2 mt-2">
                              <span>{language === 'ar' ? 'إثبات الدفع:' : 'Payment Proof:'}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const token = sessionStorage.getItem('adminToken');
                                  // Extract filename from path - handle both /uploads/resumes/filename.pdf and filename.pdf formats
                                  let filename = registration.transactionProof || '';
                                  // Remove leading slash if present
                                  if (filename.startsWith('/')) {
                                    filename = filename.substring(1);
                                  }
                                  // Extract just the filename part
                                  const pathParts = filename.split('/');
                                  filename = pathParts[pathParts.length - 1];
                                  
                                  if (filename) {
                                    window.open(`/api/resume/${filename}?apiKey=${encodeURIComponent(token || '')}`, '_blank');
                                  }
                                }}
                                className="h-6 px-2 text-xs"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                {language === 'ar' ? 'عرض إثبات الدفع' : 'View Proof'}
                              </Button>
                            </div>
                          )}
                          {!registration.transactionProof && registration.payment === 'iban' && (
                            <p className="text-yellow-600 text-xs mt-1">
                              {language === 'ar' ? '⚠️ لم يتم رفع إثبات الدفع' : '⚠️ Payment proof not uploaded'}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(registration.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll('applications')}
                >
                  {language === 'ar' ? 'تحديد الكل' : 'Select All'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleClearSelection('applications')}
                >
                  {language === 'ar' ? 'إلغاء التحديد' : 'Clear'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSortChange('applications')}
                  className="flex items-center gap-1"
                >
                  {sortOrder.applications === 'newest' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                  {language === 'ar' 
                    ? (sortOrder.applications === 'newest' ? 'الأحدث' : 'الأقدم')
                    : (sortOrder.applications === 'newest' ? 'Newest' : 'Oldest')
                  }
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV(jobApplications, 'job-applications.csv')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'تصدير' : 'Export'}
                </Button>
                {selectedItems.applications.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick('applications', selectedItems.applications)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'حذف المحدد' : 'Delete Selected'} ({selectedItems.applications.length})
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-4">
              {getSortedApplications().map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="checkbox"
                            checked={selectedItems.applications.includes(application.id)}
                            onChange={() => handleSelectItem('applications', application.id)}
                            className="rounded"
                          />
                          <h3 className="font-semibold">{application.firstName} {application.lastName}</h3>
                          <Badge variant="secondary">{application.email}</Badge>
                          <Badge variant="outline">{application.status}</Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <p>Phone: {application.phone}</p>
                          <p>Work Experience: {application.workExperience.substring(0, 100)}...</p>
                          <p>Education: {application.education.substring(0, 100)}...</p>
                          <p>Skills: {application.skills.substring(0, 100)}...</p>
                          <div className="flex items-center gap-2">
                            <span>Resume:</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const token = sessionStorage.getItem('adminToken');
                                const filename = application.resumePath.split('/').pop();
                                if (filename) {
                                  window.open(`/api/resume/${filename}?apiKey=${encodeURIComponent(token || '')}`, '_blank');
                                }
                              }}
                              className="h-6 px-2 text-xs"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              {language === 'ar' ? 'عرض السيرة الذاتية' : 'View Resume'}
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(application.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                {language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
              </DialogTitle>
              <DialogDescription>
                {language === 'ar' 
                  ? `هل أنت متأكد من حذف ${deleteIds.length} ${getDeleteTypeLabel(deleteType || 'contacts')}؟ هذا الإجراء لا يمكن التراجع عنه.`
                  : `Are you sure you want to delete ${deleteIds.length} ${getDeleteTypeLabel(deleteType || 'contacts')}? This action cannot be undone.`
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="developer-token" className={language === 'ar' ? 'text-right' : 'text-left'}>
                  {language === 'ar' ? 'رمز الحذف' : 'Delete Token'} *
                </Label>
                <Input
                  id="developer-token"
                  type="password"
                                  value={deleteToken}
                onChange={(e) => setDeleteToken(e.target.value)}
                                      placeholder={language === 'ar' ? 'أدخل رمز الحذف' : 'Enter delete token'}
                  className={`mt-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'ar' 
                    ? 'أدخل رمز المطور للتأكيد على عملية الحذف'
                    : 'Enter the developer token to confirm deletion'
                  }
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={deleteLoading}
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading || !deleteToken.trim()}
              >
                {deleteLoading 
                  ? (language === 'ar' ? 'جاري الحذف...' : 'Deleting...')
                  : (language === 'ar' ? 'حذف' : 'Delete')
                }
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 