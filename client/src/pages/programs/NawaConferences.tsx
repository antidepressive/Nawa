import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import backgroundImage from '@assets/background_1750437485135.png';

export default function NawaConferences() {
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
              {t('programs.conferences.title')}
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              {t('programs.conferences.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-16">
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          <div className="mb-12">
            <h2 className={`font-bold text-3xl text-primary mb-6 ${language === 'ar' ? 'font-cairo' : 'font-montserrat'}`}>
              {language === 'ar' ? 'نظرة عامة على البرنامج' : 'Program Overview'}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {language === 'ar' 
                ? 'تقدّم مؤتمرات نواة منتديات عالمية المستوى إلى المملكة العربية السعودية، حيث تستضيف مفكّرين دوليين، وروّاد أعمال ناجحين، ومتحدثين ملهمين. تصنع فعالياتنا تجارب تحولية تُشعل شرارة الابتكار والقيادة لدى الشباب السعودي.'
                : 'NAWA Conferences brings world-class forums to Saudi Arabia, featuring global thought leaders, successful entrepreneurs, and inspiring speakers. Our events create transformative experiences that ignite innovation and leadership among Saudi youth.'
              }
            </p>
          </div>

          {/* Program Outcomes */}
          <div className="mb-12">
            <h3 className={`font-bold text-2xl text-primary mb-6 ${language === 'ar' ? 'font-cairo' : 'font-montserrat'}`}>
              {language === 'ar' ? 'النتائج الرئيسـيــة' : 'Key Outcomes'}
            </h3>
            <ul className="space-y-4">
              <li className={`flex items-start ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0 ${language === 'ar' ? 'ml-4' : 'mr-4'}`}></div>
                <span className="text-gray-700">
                  {language === 'ar' 
                    ? 'الاطلاع على أفضل الممارسات العالمية في القيادة وريادة الأعمال'
                    : 'Exposure to global best practices in leadership and entrepreneurship'
                  }
                </span>
              </li>
              <li className={`flex items-start ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0 ${language === 'ar' ? 'ml-4' : 'mr-4'}`}></div>
                <span className="text-gray-700">
                  {language === 'ar' 
                    ? 'فرص للتواصل مع قادة القطاعات وروّاد الأعمال الناجحين'
                    : 'Networking opportunities with industry leaders and successful entrepreneurs'
                  }
                </span>
              </li>
              <li className={`flex items-start ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0 ${language === 'ar' ? 'ml-4' : 'mr-4'}`}></div>
                <span className="text-gray-700">
                  {language === 'ar' 
                    ? 'تنمية المهارات القيادية وترسيخ العقلية الريادية'
                    : 'Enhanced leadership skills and entrepreneurial mindset development'
                  }
                </span>
              </li>
              <li className={`flex items-start ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0 ${language === 'ar' ? 'ml-4' : 'mr-4'}`}></div>
                <span className="text-gray-700">
                  {language === 'ar' 
                    ? 'إلهام وتحفيز المشاركين على اتباع مسارات مهنية مبتكرة'
                    : 'Inspiration and motivation to pursue innovative career paths'
                  }
                </span>
              </li>
            </ul>
          </div>

          {/* Sponsor CTA */}
          <div className={`bg-gray-50 rounded-xl p-8 ${language === 'ar' ? 'text-center' : 'text-center'}`}>
            <h3 className={`font-bold text-2xl text-primary mb-4 ${language === 'ar' ? 'font-cairo' : 'font-montserrat'}`}>
              {language === 'ar' ? 'رعاية هـذا البرنامج' : 'Sponsor This Program'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'ar' 
                ? 'أبرز علامتك التجارية أمام آلاف الشباب السعوديين الطموحين وضع شركتك في موقع الريادة في تنمية الشباب.'
                : 'Showcase your brand to thousands of ambitious Saudi youth and position your company as a leader in youth development.'
              }
            </p>
            <Button onClick={scrollToContact} size="lg" className="bg-primary hover:bg-primary/90">
              {language === 'ar' ? 'كن راعياً للمؤتمرات' : 'Become a Conference Sponsor'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}