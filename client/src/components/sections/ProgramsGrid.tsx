import { useLanguage } from '../../contexts/LanguageContext';
import { SectionHeading } from '../ui/SectionHeading';
import { programsData } from '../../data/content';
import { Rocket, Users, Globe, Check, ArrowRight, Handshake } from 'lucide-react';
import { Link } from 'wouter';

const iconMap = {
  rocket: Rocket,
  users: Users,
  globe: Globe
};

export const ProgramsGrid = () => {
  const { t, language } = useLanguage();

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="programs" className="py-20 bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t('programs.title')}
          subtitle={t('programs.subtitle')}
        />

        <div className="grid md:grid-cols-3 gap-8">
          {programsData.map((program) => {
            const IconComponent = iconMap[program.icon as keyof typeof iconMap];
            return (
              <div
                key={program.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
              >
                <div className="p-8 flex flex-col flex-grow">
                  <div className={`w-16 h-16 bg-gradient-to-br ${program.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-montserrat font-bold text-2xl text-primary mb-4">
                    {t(`programs.${program.id}.title`)}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {t(`programs.${program.id}.description`)}
                  </p>
                  <ul className="space-y-2 mb-8 text-sm text-gray-600 flex-grow">
                    {(language === 'ar' && program.featuresAr ? program.featuresAr : program.features).map((feature, index) => (
                      <li key={index} className={`flex items-start ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <Check className={`w-4 h-4 text-accent flex-shrink-0 mt-0.5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                        <span className={language === 'ar' ? 'arabic-numbers text-right' : ''}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    href={`/programs/${program.url}`}
                    className="inline-flex items-center text-primary font-semibold hover:text-blue-700 transition-colors group focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 mt-auto"
                  >
                    {t('programs.learnMore')}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={scrollToContact}
            className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            <Handshake className="w-5 h-5 mr-2" />
            {t('programs.sponsorPrograms')}
          </button>
        </div>
      </div>
    </section>
  );
};
