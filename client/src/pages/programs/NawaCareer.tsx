import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import backgroundImage from '@assets/background_1750437485135.png';

export default function NawaCareer() {
  const { t } = useLanguage();

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
                Back to Home
              </Button>
            </Link>
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
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="font-montserrat font-bold text-3xl text-primary mb-6">
              Program Overview
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              NAWA Career is our flagship professional development program designed to bridge the gap between education and industry. Through personalized coaching, industry mentorship, and direct pathways to employment, we prepare Saudi youth for successful careers aligned with Vision 2030 goals.
            </p>
          </div>

          {/* Program Outcomes */}
          <div className="mb-12">
            <h3 className="font-montserrat font-bold text-2xl text-primary mb-6">
              Key Outcomes
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <span className="text-gray-700">Enhanced employability skills and professional competencies</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <span className="text-gray-700">Direct connections with industry leaders and potential employers</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <span className="text-gray-700">Personalized career coaching and professional development plans</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <span className="text-gray-700">Practical experience through internships and project-based learning</span>
              </li>
            </ul>
          </div>

          {/* Sponsor CTA */}
          <div className="text-center bg-gray-50 rounded-xl p-8">
            <h3 className="font-montserrat font-bold text-2xl text-primary mb-4">
              Sponsor This Program
            </h3>
            <p className="text-gray-600 mb-6">
              Partner with us to shape the future workforce of Saudi Arabia and gain direct access to top talent.
            </p>
            <Button onClick={scrollToContact} size="lg" className="bg-primary hover:bg-primary/90">
              Become a Program Sponsor
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}