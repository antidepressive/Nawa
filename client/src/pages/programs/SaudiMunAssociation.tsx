import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../../components/ui/button';

export default function SaudiMunAssociation() {
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
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-montserrat font-bold text-4xl md:text-5xl mb-6">
            {t('programs.mun.title')}
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            {t('programs.mun.description')}
          </p>
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
              The Saudi MUN Association develops the next generation of diplomatic leaders through immersive Model United Nations experiences. Our programs simulate international negotiations, fostering global awareness, critical thinking, and diplomatic skills essential for Saudi Arabia's growing role on the world stage.
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
                <span className="text-gray-700">Enhanced diplomatic and negotiation skills through realistic simulations</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <span className="text-gray-700">Increased global awareness and understanding of international relations</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <span className="text-gray-700">Development of critical thinking and public speaking abilities</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <span className="text-gray-700">Leadership capabilities through committee chair and delegation roles</span>
              </li>
            </ul>
          </div>

          {/* Sponsor CTA */}
          <div className="text-center bg-gray-50 rounded-xl p-8">
            <h3 className="font-montserrat font-bold text-2xl text-primary mb-4">
              Sponsor This Program
            </h3>
            <p className="text-gray-600 mb-6">
              Support the development of Saudi Arabia's future diplomatic leaders and global representatives.
            </p>
            <Button onClick={scrollToContact} size="lg" className="bg-primary hover:bg-primary/90">
              Become a MUN Sponsor
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}