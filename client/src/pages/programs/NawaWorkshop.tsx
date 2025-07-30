import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Calendar, Users, Target, BookOpen, Globe, Heart, Brain, Users2, Clock, MapPin, Star, Download } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../../lib/queryClient';
import { useToast } from '../../hooks/use-toast';
import backgroundImage from '@assets/nawa-background.png';
import nawaEQPdf from '@assets/NawaEQ.pdf';

const workshopRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  payment: z.literal('venue'),
  bundle: z.enum(['89', '59', '199'], { required_error: 'Please select a bundle' }),
  friend1Name: z.string().optional(),
  friend1Email: z.string().optional(),
  friend1Phone: z.string().optional(),
  friend2Name: z.string().optional(),
  friend2Email: z.string().optional(),
  friend2Phone: z.string().optional(),
}).refine((data) => {
  if (data.bundle === '199') {
    return data.friend1Name && data.friend1Email && data.friend1Phone && 
           data.friend2Name && data.friend2Email && data.friend2Phone;
  }
  return true;
}, {
  message: "Friends' information is required for the Three Friends Bundle",
  path: ['friend1Name']
});

type WorkshopRegistrationForm = z.infer<typeof workshopRegistrationSchema>;

export default function NawaWorkshop() {
  const { t, language, toggleLanguage } = useLanguage();
  const [, setLocation] = useLocation();
  const [selectedBundle, setSelectedBundle] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    document.title = 'Nawa x Masaha—Emotional Intelligence Workshop Day - نَوَاة';
    window.scrollTo(0, 0);
  }, []);

  const form = useForm<WorkshopRegistrationForm>({
    resolver: zodResolver(workshopRegistrationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      payment: 'venue',
      bundle: undefined,
      friend1Name: '',
      friend1Email: '',
      friend1Phone: '',
      friend2Name: '',
      friend2Email: '',
      friend2Phone: '',
    }
  });

  const registrationMutation = useMutation({
    mutationFn: (data: WorkshopRegistrationForm) => 
      apiRequest('POST', '/api/workshop', data),
    onSuccess: () => {
      toast({
        title: language === 'ar' ? 'تم التسجيل بنجاح!' : 'Registration Successful!',
        description: language === 'ar' 
          ? 'شكراً لك على التسجيل في ورشة العمل. سنتواصل معك قريباً.' 
          : 'Thank you for registering for the workshop. We will contact you soon.',
      });
      form.reset();
      setSelectedBundle('');
    },
    onError: (error: any) => {
      toast({
        title: language === 'ar' ? 'خطأ في التسجيل' : 'Registration Error',
        description: error.message || (language === 'ar' ? 'حدث خطأ أثناء التسجيل' : 'An error occurred during registration'),
        variant: 'destructive',
      });
    }
  });

  const onSubmit = (data: WorkshopRegistrationForm) => {
    registrationMutation.mutate(data);
  };

  const features = [
    {
      icon: Heart,
      title: language === 'ar' ? 'بناء الوعي الذاتي' : 'Building Self-Awareness',
      description: language === 'ar' ? 'اكتشف نقاط قوتك وتعلم كيفية فهم شخصيتك بشكل أعمق' : 'Discover your strengths and learn to understand your personality deeply'
    },
    {
      icon: Brain,
      title: language === 'ar' ? 'تطوير التعاطف' : 'Developing Empathy',
      description: language === 'ar' ? 'تعلم فهم الآخرين والتواصل معهم بشكل أكثر فعالية' : 'Learn to understand others and communicate with them more effectively'
    },
    {
      icon: Users2,
      title: language === 'ar' ? 'القيادة العاطفية' : 'Emotional Leadership',
      description: language === 'ar' ? 'اكتسب المهارات الناعمة وراء كل نجاح صعب' : 'Gain the soft skills behind every hard success'
    }
  ];

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        height: '100vh'
      }}
    >
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
              {t('workshop.heroTitle')}
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              {language === 'ar' 
                ? 'ورشة عمل مكثفة ليوم واحد تركز على بناء الوعي الذاتي والتعاطف والقيادة العاطفية'
                : 'A one-day immersive workshop focused on building self-awareness, empathy, and emotional leadership'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Workshop Card */}
      <section className="py-16 bg-white/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-12">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className={`font-bold text-2xl text-gray-900 ${language === 'ar' ? 'font-cairo text-right' : 'font-montserrat'}`}>
                    {t('workshop.heroTitle')}
                  </h3>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    {language === 'ar' ? 'جديد' : 'New'}
                  </Badge>
                </div>
                
                <p className={`text-gray-600 mb-4 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' 
                    ? 'ورشة عمل مكثفة ليوم واحد تركز على بناء الوعي الذاتي والتعاطف والقيادة العاطفية. من خلال 3 فصول متناوبة، ستحصل على أدوات عملية لفهم نفسك بشكل أفضل والتواصل مع الآخرين.'
                    : 'A one-day immersive workshop focused on building self-awareness, empathy, and emotional leadership. Through 3 rotating classes, you\'ll gain practical tools to better understand yourself and connect with others.'
                  }
                </p>
                
                <div className={`flex flex-wrap gap-4 mb-6 ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
                  <div className="flex items-center gap-2 text-green-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {language === 'ar' ? 'يوم واحد مكثف' : 'One intensive day'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {language === 'ar' ? '10 ورش عمل ديناميكية' : '10 dynamic workshops'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {language === 'ar' ? 'مهارات ناعمة' : 'Soft skills'}
                    </span>
                  </div>
                </div>
                
                <p className={`text-lg text-gray-600 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' 
                    ? 'بقيادة الفريق المؤسس لنواة ومساحة، هذه الورشة هي بوابتك لإتقان المهارة الناعمة وراء كل نجاح صعب.'
                    : 'Led by the founding team of NAWA and Masaha, this workshop is your gateway to mastering the soft skill behind every hard success.'
                  }
                </p>
                
                <div className={`flex flex-col sm:flex-row gap-4 mt-6 ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 text-lg font-semibold flex items-center gap-2"
                    onClick={() => window.open(nawaEQPdf, '_blank')}
                  >
                    <Download className="w-5 h-5" />
                    <span>{language === 'ar' ? 'جدول الفعالية' : 'Event Schedule'}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Description */}
      <section className="py-16 bg-white/95 backdrop-blur-sm">
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          <div className="mb-12">
            <h2 className={`font-bold text-3xl text-primary mb-6 ${language === 'ar' ? 'font-cairo' : 'font-montserrat'}`}>
              {language === 'ar' ? 'عن الورشة' : 'About the Workshop'}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('workshop.heroDescription')}
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className={`text-xl ${language === 'ar' ? 'font-cairo' : 'font-montserrat'}`}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className={`text-center ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Workshop Details */}
          <div className="bg-gray-50 rounded-xl p-8 mb-12">
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
                    {t('workshop.dateTimeLabel')}
                  </p>
                  <p className="text-gray-600">
                    {t('workshop.dateTimeValue')}
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                  <p className="font-semibold text-gray-900">
                    {t('workshop.classesLabel')}
                  </p>
                  <p className="text-gray-600">
                    {t('workshop.classesValue')}
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
                    {language === 'ar' ? 'فريق نواة ومساحة' : 'NAWA & Masaha team'}
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
                    JHUB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 bg-white/95 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`font-bold text-3xl text-primary mb-6 ${language === 'ar' ? 'font-cairo' : 'font-montserrat'}`}>
              {language === 'ar' ? 'التسجيل في الورشة' : 'Workshop Registration'}
            </h2>
            <p className="text-lg text-gray-600">
              {language === 'ar' 
                ? 'املأ النموذج أدناه للتسجيل في ورشة العمل'
                : 'Fill out the form below to register for the workshop'
              }
            </p>
          </div>

          <Card className="border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className={language === 'ar' ? 'text-right' : 'text-left'}>
                      {language === 'ar' ? 'الاسم' : 'Name'} *
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
                  <Input
                    id="phone"
                    {...form.register('phone')}
                    className={`mt-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                    placeholder={language === 'ar' ? '+966xxxxxxxxx' : '+966xxxxxxxxx'}
                  />
                  {form.formState.errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
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

                  <div>
                    <Label className={language === 'ar' ? 'text-right' : 'text-left'}>
                      {language === 'ar' ? 'الباقة' : 'Bundle'} *
                    </Label>
                    <Select 
                      onValueChange={(value) => {
                        form.setValue('bundle', value as '89' | '59' | '199');
                        setSelectedBundle(value);
                      }}
                      value={form.watch('bundle') || ''}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={language === 'ar' ? 'اختر الباقة' : 'Select bundle'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="59">
                          {language === 'ar' ? 'الطائر المبكر - 59 ريال' : 'Early Bird – 59 SAR'}
                      </SelectItem>    
                        <SelectItem value="89">
                          {language === 'ar' ? 'الباقة الأساسية - 89 ريال' : 'Standard Bundle – 89 SAR'}
                        </SelectItem>
                        <SelectItem value="199">
                          {language === 'ar' ? 'باقة ثلاثة أصدقاء - 199 ريال' : 'Three Friends Bundle – 199 SAR'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.bundle && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.bundle.message}</p>
                    )}
                  </div>
                </div>

                {/* Friends Information (only show if Three Friends Bundle is selected) */}
                {selectedBundle === '199' && (
                  <div className="space-y-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className={`font-semibold text-lg text-primary ${language === 'ar' ? 'font-cairo text-right' : 'font-montserrat'}`}>
                      {language === 'ar' ? 'معلومات الأصدقاء' : 'Friends Information'}
                    </h4>
                    
                    {/* Friend 1 */}
                    <div>
                      <h5 className={`font-medium text-gray-900 mb-3 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        {language === 'ar' ? 'الصديق الأول' : 'Friend 1'}
                      </h5>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="friend1Name" className={language === 'ar' ? 'text-right' : 'text-left'}>
                            {language === 'ar' ? 'الاسم' : 'Name'} *
                          </Label>
                          <Input
                            id="friend1Name"
                            {...form.register('friend1Name')}
                            className={`mt-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                            placeholder={language === 'ar' ? 'اسم الصديق الأول' : 'Friend 1 Name'}
                          />
                        </div>
                        <div>
                          <Label htmlFor="friend1Email" className={language === 'ar' ? 'text-right' : 'text-left'}>
                            {language === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
                          </Label>
                          <Input
                            id="friend1Email"
                            type="email"
                            {...form.register('friend1Email')}
                            className={`mt-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                            placeholder={language === 'ar' ? 'friend1@email.com' : 'friend1@email.com'}
                          />
                        </div>
                        <div>
                          <Label htmlFor="friend1Phone" className={language === 'ar' ? 'text-right' : 'text-left'}>
                            {language === 'ar' ? 'رقم الهاتف' : 'Phone'} *
                          </Label>
                          <Input
                            id="friend1Phone"
                            {...form.register('friend1Phone')}
                            className={`mt-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                            placeholder={language === 'ar' ? '+966xxxxxxxxx' : '+966xxxxxxxxx'}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Friend 2 */}
                    <div>
                      <h5 className={`font-medium text-gray-900 mb-3 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        {language === 'ar' ? 'الصديق الثاني' : 'Friend 2'}
                      </h5>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="friend2Name" className={language === 'ar' ? 'text-right' : 'text-left'}>
                            {language === 'ar' ? 'الاسم' : 'Name'} *
                          </Label>
                          <Input
                            id="friend2Name"
                            {...form.register('friend2Name')}
                            className={`mt-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                            placeholder={language === 'ar' ? 'اسم الصديق الثاني' : 'Friend 2 Name'}
                          />
                        </div>
                        <div>
                          <Label htmlFor="friend2Email" className={language === 'ar' ? 'text-right' : 'text-left'}>
                            {language === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
                          </Label>
                          <Input
                            id="friend2Email"
                            type="email"
                            {...form.register('friend2Email')}
                            className={`mt-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                            placeholder={language === 'ar' ? 'friend2@email.com' : 'friend2@email.com'}
                          />
                        </div>
                        <div>
                          <Label htmlFor="friend2Phone" className={language === 'ar' ? 'text-right' : 'text-left'}>
                            {language === 'ar' ? 'رقم الهاتف' : 'Phone'} *
                          </Label>
                          <Input
                            id="friend2Phone"
                            {...form.register('friend2Phone')}
                            className={`mt-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                            placeholder={language === 'ar' ? '+966xxxxxxxxx' : '+966xxxxxxxxx'}
                          />
                        </div>
                      </div>
                    </div>
                    {form.formState.errors.friend1Name && (
                      <p className="text-red-500 text-sm">{form.formState.errors.friend1Name.message}</p>
                    )}
                  </div>
                )}

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
