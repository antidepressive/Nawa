import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Calendar, Users, Target, BookOpen, Globe, Heart, Clock } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useEffect } from 'react';
import backgroundImage from '@assets/nawa-background.png';

export default function NawaCareer() {
  const { t, language, toggleLanguage } = useLanguage();
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = 'Nawa - نَوَاة';
    window.scrollTo(0, 0);
  }, []);

  const navigateToContact = () => {
    setLocation('/');
    // Use setTimeout to ensure navigation completes before scrolling
    setTimeout(() => {
      const element = document.querySelector('#contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };



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
            <Link href="/">
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'العودة إلى الرئيسية' : 'Back to Home'}
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
              {t('programs.career.title')}
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              {t('programs.career.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-16 bg-white/95 backdrop-blur-sm">
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          <div className="mb-12">
            <h2 className={`font-bold text-3xl text-primary mb-6 ${language === 'ar' ? 'font-cairo' : 'font-montserrat'}`}>
              {t('career.heroTitle')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('career.heroDescription')}
            </p>
          </div>

          {/* Program Outcomes */}
          <div className="mb-12">
            <h3 className={`font-bold text-2xl text-primary mb-6 ${language === 'ar' ? 'font-cairo' : 'font-montserrat'}`}>
              {t('career.outcomesTitle')}
            </h3>
            <ul className="space-y-4">
              <li className={`flex items-start ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0 ${language === 'ar' ? 'ml-4' : 'mr-4'}`}></div>
                <span className="text-gray-700">
                  {t('career.outcome1')}
                </span>
              </li>
              <li className={`flex items-start ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0 ${language === 'ar' ? 'ml-4' : 'mr-4'}`}></div>
                <span className="text-gray-700">
                  {t('career.outcome2')}
                </span>
              </li>
              <li className={`flex items-start ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0 ${language === 'ar' ? 'ml-4' : 'mr-4'}`}></div>
                <span className="text-gray-700">
                  {t('career.outcome3')}
                </span>
              </li>
              <li className={`flex items-start ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0 ${language === 'ar' ? 'ml-4' : 'mr-4'}`}></div>
                <span className="text-gray-700">
                  {t('career.outcome4')}
                </span>
              </li>
            </ul>
          </div>

          {/* Current Programs */}
          <div className="mb-12">
            <h3 className={`font-bold text-2xl text-primary mb-8 ${language === 'ar' ? 'font-cairo text-center' : 'font-montserrat text-center'}`}>
              {language === 'ar' ? 'البرامج الحالية' : 'Current Programs'}
            </h3>
            
            {/* Workshop Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className={`font-bold text-xl text-gray-900 ${language === 'ar' ? 'font-cairo text-right' : 'font-montserrat'}`}>
                      {t('workshop.heroTitle')}
                    </h4>
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
                      {t('workshop.classesValue')}
                    </span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {language === 'ar' ? 'مهارات ناعمة' : 'Soft skills'}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`flex flex-col sm:flex-row gap-3 ${language === 'ar' ? 'sm:justify-end' : 'sm:justify-start'}`}>
                    <Link href="/programs/nawa-workshop">
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        {language === 'ar' ? 'تعرف على المزيد' : 'Learn More'}
                      </Button>
                    </Link>
                    <Link href="/programs/nawa-workshop">
                      <Button 
                        variant="outline" 
                        className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                      >
                        {language === 'ar' ? 'سجل الآن' : 'Register Now'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* CTP Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-bold text-xl text-gray-900 mb-3 ${language === 'ar' ? 'font-cairo text-right' : 'font-montserrat'}`}>
                    {language === 'ar' ? 'برنامج التدريب الاستشاري' : 'Consulting Training Program'}
                  </h4>
                  
                  <p className={`text-gray-600 mb-4 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {language === 'ar' 
                      ? 'برنامج تدريبي مكثف لمدة 12 يوماً في جدة مصمم لإعدادك لمهنة استشارية حقيقية. تعلم مباشرة من خبراء في شركات رائدة مثل KPMG وPure Consulting وTAM.'
                      : 'A 12-day intensive bootcamp in Jeddah designed to prepare you for a real consulting career. Learn directly from experts at leading companies like KPMG, Pure Consulting, and TAM.'
                    }
                  </p>
                  
                  <div className={`flex flex-wrap gap-4 mb-6 ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex items-center gap-2 text-primary">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {language === 'ar' ? '12 يوم مكثف' : '12 days intensive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {language === 'ar' ? 'خبراء من الشركات الرائدة' : 'Industry experts'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <Target className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {language === 'ar' ? 'جدة' : 'Jeddah'}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`flex flex-col sm:flex-row gap-3 ${language === 'ar' ? 'sm:justify-end' : 'sm:justify-start'}`}>
                    <Link href="/programs/consulting-training-program">
                      <Button className="bg-primary hover:bg-blue-700 text-white">
                        {language === 'ar' ? 'تعرف على المزيد' : 'Learn More'}
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="border-gray-400 text-gray-500 cursor-not-allowed"
                      disabled
                    >
                      {language === 'ar' ? 'التسجيل مغلق' : 'Registration Closed'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Sponsor CTA */}
          <div className={`bg-gray-50 rounded-xl p-8 ${language === 'ar' ? 'text-center' : 'text-center'}`}>
            <h3 className={`font-bold text-2xl text-primary mb-4 ${language === 'ar' ? 'font-cairo' : 'font-montserrat'}`}>
              {t('career.sponsorTitle')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('career.sponsorDescription')}
            </p>
            <Button onClick={navigateToContact} size="lg" className="bg-primary hover:bg-primary/90">
              {t('career.sponsorButton')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
