import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import backgroundImage from '@assets/background_1750437485135.png';

export default function SaudiMunAssociation() {
  const { t, language } = useLanguage();

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="text-white py-20 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-blue-600/80"></div>
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home Button */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'العودة إلى الرئيسية' : 'Back to Home'}
              </Button>
            </Link>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="font-montserrat font-bold text-3xl text-primary mb-6">
              {language === 'ar' ? 'نظرة عامة على البرنامج' : 'Program Overview'}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {language === 'ar' 
                ? 'تُطوِّر المؤسسة السعودية لمحاكاة الأمم المتحدة الجيلَ القادم من القادة الدبلوماسيين من خلال تجارب محاكاة الأمم المتحدة الغامرة. تُحاكي برامجنا المفاوضات الدولية، فتُنمِّي الوعي العالمي، والتفكير النقدي، ومهارات الدبلوماسية الضرورية لدور المملكة المتنامي على الساحة الدولية.'
                : 'The Saudi MUN Association develops the next generation of diplomatic leaders through immersive Model United Nations experiences. Our programs simulate international negotiations, fostering global awareness, critical thinking, and diplomatic skills essential for Saudi Arabia\'s growing role on the world stage.'
              }
            </p>
          </div>

          {/* Program Outcomes */}
          <div className="mb-12">
            <h3 className="font-montserrat font-bold text-2xl text-primary mb-6">
              {language === 'ar' ? 'النتائج الرئيسـيــة' : 'Key Outcomes'}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <span className="text-gray-700">
                  {language === 'ar' 
                    ? 'تعزيز مهارات الدبلوماسية والتفاوض عبر محاكاة واقعية'
                    : 'Enhanced diplomatic and negotiation skills through realistic simulations'
                  }
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <span className="text-gray-700">
                  {language === 'ar' 
                    ? 'زيادة الوعي العالمي وفهم العلاقات الدولية'
                    : 'Increased global awareness and understanding of international relations'
                  }
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <span className="text-gray-700">
                  {language === 'ar' 
                    ? 'تنمية مهارات التفكير النقدي والإلقاء أمام الجمهور'
                    : 'Development of critical thinking and public speaking abilities'
                  }
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <span className="text-gray-700">
                  {language === 'ar' 
                    ? 'تطوير القدرات القيادية من خلال رئاسة اللجان وأدوار الوفود'
                    : 'Leadership capabilities through committee chair and delegation roles'
                  }
                </span>
              </li>
            </ul>
          </div>

          {/* Sponsor CTA */}
          <div className="text-center bg-gray-50 rounded-xl p-8">
            <h3 className="font-montserrat font-bold text-2xl text-primary mb-4">
              {language === 'ar' ? 'رعاية هـذا البرنامج' : 'Sponsor This Program'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'ar' 
                ? 'ادعم إعداد قادة المملكة الدبلوماسيين وممثليها العالميين في المستقبل.'
                : 'Support the development of Saudi Arabia\'s future diplomatic leaders and global representatives.'
              }
            </p>
            <Button onClick={scrollToContact} size="lg" className="bg-primary hover:bg-primary/90">
              {language === 'ar' ? 'كن راعياً لبرامج نموذج الأمم المتحدة' : 'Become a MUN Sponsor'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}