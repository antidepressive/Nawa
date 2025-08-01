import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Globe } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useEffect } from 'react';
import backgroundImage from '@assets/nawa-background.webp';

export default function SaudiMunAssociation() {
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
              {t('programs.mun.title')}
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              {t('programs.mun.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-16">
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          <div className="mb-12 bg-white/95 backdrop-blur-sm rounded-xl p-8">
            <h2 className={`font-bold text-3xl text-primary mb-6 ${language === 'ar' ? 'font-cairo' : 'font-montserrat'}`}>
              {t('mun.heroTitle')}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('mun.heroDescription')}
            </p>
          </div>

          {/* Program Outcomes */}
          <div className="mb-12 bg-white/95 backdrop-blur-sm rounded-xl p-8">
            <h3 className={`font-bold text-2xl text-primary mb-6 ${language === 'ar' ? 'font-cairo' : 'font-montserrat'}`}>
              {t('mun.outcomesTitle')}
            </h3>
            <ul className="space-y-4">
              <li className={`flex items-start ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0 ${language === 'ar' ? 'ml-4' : 'mr-4'}`}></div>
                <span className="text-gray-700">
                  {t('mun.outcome1')}
                </span>
              </li>
              <li className={`flex items-start ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0 ${language === 'ar' ? 'ml-4' : 'mr-4'}`}></div>
                <span className="text-gray-700">
                  {t('mun.outcome2')}
                </span>
              </li>
              <li className={`flex items-start ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0 ${language === 'ar' ? 'ml-4' : 'mr-4'}`}></div>
                <span className="text-gray-700">
                  {t('mun.outcome3')}
                </span>
              </li>
              <li className={`flex items-start ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0 ${language === 'ar' ? 'ml-4' : 'mr-4'}`}></div>
                <span className="text-gray-700">
                  {t('mun.outcome4')}
                </span>
              </li>
            </ul>
          </div>

          {/* Sponsor CTA */}
          <div className={`bg-white/95 backdrop-blur-sm rounded-xl p-8 ${language === 'ar' ? 'text-center' : 'text-center'}`}>
            <h3 className={`font-bold text-2xl text-primary mb-4 ${language === 'ar' ? 'font-cairo' : 'font-montserrat'}`}>
              {t('mun.sponsorTitle')}
            </h3>
            <p className="text-gray-700 mb-6">
              {t('mun.sponsorDescription')}
            </p>
            <Button onClick={navigateToContact} size="lg" className="bg-primary hover:bg-primary/90">
              {t('mun.sponsorButton')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
