import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Globe, Clock, Users, MapPin, Star, Mic, MessageSquare, Presentation } from 'lucide-react';
import { Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../../lib/queryClient';
import { useToast } from '../../hooks/use-toast';
import backgroundImage from '@assets/nawa-background.webp';

// Custom Phone Input Component
const PhoneInput = ({ 
  id, 
  value, 
  onChange, 
  onBlur, 
  className, 
  placeholder, 
  error 
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  placeholder?: string;
  error?: string;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Remove any non-digit characters and spaces
    const cleaned = input.replace(/[^\d]/g, '');
    
    // If the input doesn't start with 966, add it
    if (!cleaned.startsWith('966')) {
      onChange(`966${cleaned}`);
    } else {
      onChange(cleaned);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent backspace from deleting the 966 prefix
    if (e.key === 'Backspace' && value === '966') {
      e.preventDefault();
    }
  };

  return (
    <div>
      <Input
        id={id}
        value={value || ''}
        onChange={handleChange}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        className={className}
        placeholder={placeholder}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

const leadershipWorkshopRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required').refine(
    (phone) => phone.startsWith('966') && phone.length >= 12,
    'Phone number must start with 966 and be at least 9 digits after the prefix'
  ),
  payment: z.literal('venue'),
});

type LeadershipWorkshopRegistrationForm = z.infer<typeof leadershipWorkshopRegistrationSchema>;

export default function LeadershipWorkshop() {
  const { t, language, toggleLanguage } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    document.title = 'How to Speak Like a Leader Workshop - نَوَاة';
    window.scrollTo(0, 0);
  }, []);

  const form = useForm<LeadershipWorkshopRegistrationForm>({
    resolver: zodResolver(leadershipWorkshopRegistrationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      payment: 'venue',
    }
  });

  const registrationMutation = useMutation({
    mutationFn: (data: LeadershipWorkshopRegistrationForm) => 
      apiRequest('POST', '/api/leadership-workshop', data),
    onSuccess: () => {
      toast({
        title: language === 'ar' ? 'تم التسجيل بنجاح!' : 'Registration Successful!',
        description: language === 'ar' 
          ? 'شكراً لك على التسجيل في ورشة العمل. يرجى التحقق من بريدك الإلكتروني للحصول على تأكيد التسجيل.' 
          : 'Thank you for registering for the workshop. Please check your email for registration confirmation.',
        duration: Infinity,
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: language === 'ar' ? 'خطأ في التسجيل' : 'Registration Error',
        description: error.message || (language === 'ar' ? 'حدث خطأ أثناء التسجيل' : 'An error occurred during registration'),
        variant: 'destructive',
      });
    }
  });

  const onSubmit = (data: LeadershipWorkshopRegistrationForm) => {
    registrationMutation.mutate(data);
  };

  const sessions = [
    {
      icon: Presentation,
      title: t('leadershipWorkshop.session1Title'),
      description: t('leadershipWorkshop.session1Description')
    },
    {
      icon: Mic,
      title: t('leadershipWorkshop.session2Title'),
      description: t('leadershipWorkshop.session2Description')
    },
    {
      icon: MessageSquare,
      title: t('leadershipWorkshop.session3Title'),
      description: t('leadershipWorkshop.session3Description')
    }
  ];

  return (
    <div className="relative">
      {/* Background wrapper that extends throughout the whole page */}
      <div 
        className="fixed inset-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          zIndex: -1
        }}
      ></div>
      
      {/* Hero Banner */}
      <section className="text-white py-20 relative overflow-hidden">
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-blue-600/80"></div>
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home Button and Language Toggle */}
          <div className="mb-8 flex justify-between items-center">
            <Link href="/programs/nawa-career">
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'العودة إلى المسار المهني' : 'Back to Career'}
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={toggleLanguage}
            >
              <Globe className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'EN' : 'العربية'}
            </Button>
          </div>
          <div className="text-center">
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl mb-6">
              {t('leadershipWorkshop.heroTitle')}
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              {t('leadershipWorkshop.heroDescription')}
            </p>
          </div>
        </div>
      </section>

      {/* Workshop Card */}
      <section className="py-16 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-12">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Presentation className="w-8 h-8 text-primary" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className={`font-bold text-2xl text-gray-900 ${language === 'ar' ? 'font-cairo text-right' : 'font-montserrat'}`}>
                    {t('leadershipWorkshop.heroTitle')}
                  </h3>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                    {language === 'ar' ? 'جديد' : 'New'}
                  </Badge>
                </div>
                
                <p className={`text-gray-600 mb-4 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {t('leadershipWorkshop.heroDescription')}
                </p>
                
                <div className={`flex flex-wrap gap-4 mb-6 ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
                  <div className="flex items-center gap-2 text-primary">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {t('leadershipWorkshop.dateTimeValue')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {t('leadershipWorkshop.classesValue')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {t('leadershipWorkshop.fee')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Description */}
      <section className="py-8">
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          <div className="mb-12 bg-white/95 backdrop-blur-sm rounded-xl p-8">
            <h2 className={`font-bold text-3xl text-primary mb-6 ${language === 'ar' ? 'font-cairo' : 'font-montserrat'}`}>
              {language === 'ar' ? 'عن الورشة' : 'About the Workshop'}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('leadershipWorkshop.heroDescription')}
            </p>
          </div>

          {/* Sessions */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {sessions.map((session, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <session.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className={`text-xl ${language === 'ar' ? 'font-cairo' : 'font-montserrat'}`}>
                    {session.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {session.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Competition Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 mb-6">
            <h3 className={`font-bold text-2xl text-primary mb-4 ${language === 'ar' ? 'font-cairo text-center' : 'font-montserrat text-center'}`}>
              {t('leadershipWorkshop.competitionTitle')}
            </h3>
            <p className={`text-lg text-gray-700 leading-relaxed text-center ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {t('leadershipWorkshop.competitionDescription')}
            </p>
          </div>

          {/* Workshop Details */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 mb-6">
            <h3 className={`font-bold text-2xl text-primary mb-6 ${language === 'ar' ? 'font-cairo text-center' : 'font-montserrat text-center'}`}>
              {language === 'ar' ? 'تفاصيل الورشة' : 'Workshop Details'}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                  <p className="font-semibold text-gray-900">
                    {t('leadershipWorkshop.dateTimeLabel')}
                  </p>
                  <p className="text-gray-600">
                    {t('leadershipWorkshop.dateTimeValue')}
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                  <p className="font-semibold text-gray-900">
                    {t('leadershipWorkshop.classesLabel')}
                  </p>
                  <p className="text-gray-600">
                    {t('leadershipWorkshop.classesValue')}
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                  <p className="font-semibold text-gray-900">
                    {language === 'ar' ? 'المقدمون' : 'Led by'}
                  </p>
                  <p className="text-gray-600">
                    {language === 'ar' ? 'فريق نواة' : 'NAWA team'}
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                  <p className="font-semibold text-gray-900">
                    {language === 'ar' ? 'الموقع' : 'Location'}
                  </p>
                  <p className="text-gray-600">
                    J-Hub
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="registration-form" className="py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-gray-200 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className={`font-bold text-3xl text-primary mb-6 ${language === 'ar' ? 'font-cairo' : 'font-montserrat'}`}>
                  {language === 'ar' ? 'التسجيل في الورشة' : 'Workshop Registration'}
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  {language === 'ar' 
                    ? `رسوم الورشة: ${t('leadershipWorkshop.fee')}`
                    : `Workshop Fee: ${t('leadershipWorkshop.fee')}`
                  }
                </p>
              </div>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className={language === 'ar' ? 'text-right' : 'text-left'}>
                      {language === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
                    </Label>
                    <Input
                      id="name"
                      {...form.register('name')}
                      className={`mt-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                      placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                    />
                    {form.formState.errors.name && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className={language === 'ar' ? 'text-right' : 'text-left'}>
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register('email')}
                      className={`mt-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                      placeholder={language === 'ar' ? 'example@email.com' : 'example@email.com'}
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className={language === 'ar' ? 'text-right' : 'text-left'}>
                    {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
                  </Label>
                  <PhoneInput
                    id="phone"
                    value={form.watch('phone') || ''}
                    onChange={(value) => form.setValue('phone', value)}
                    onBlur={form.handleBlur}
                    className={`mt-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                    error={form.formState.errors.phone?.message}
                    placeholder={language === 'ar' ? '+966xxxxxxxxx' : '+966xxxxxxxxx'}
                  />
                </div>

                <div>
                  <Label className={language === 'ar' ? 'text-right' : 'text-left'}>
                    {language === 'ar' ? 'طريقة الدفع' : 'Payment'}
                  </Label>
                  <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <span className="text-gray-700 font-medium">
                      {language === 'ar' ? 'في المكان' : 'At Venue'}
                    </span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-blue-700 text-white py-3"
                  disabled={registrationMutation.isPending}
                >
                  {registrationMutation.isPending 
                    ? (language === 'ar' ? 'جاري التسجيل...' : 'Registering...')
                    : (language === 'ar' ? 'سجل الآن' : 'Register Now')
                  }
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

