import { useLanguage } from '../../contexts/LanguageContext';
import { partnersData } from '../../data/content';

export const SponsorMarquee = () => {
  const { t, language } = useLanguage();

  return (
    <section className="py-16 bg-white border-t border-gray-100 w-full overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-2xl md:text-3xl text-primary mb-4">
            {t('partners.title')}
          </h2>
          <p className="text-gray-600">{t('partners.subtitle')}</p>
        </div>

        {/* Infinite Scrolling Partners Marquee */}
        <div className="marquee-content">
          <div 
            className="marquee-track animate-infinite-scroll"
            style={{ 
              direction: language === 'ar' ? 'rtl' : 'ltr'
            }}
          >
            {/* First set of partners */}
            {partnersData.map((partner, index) => (
              <div
                key={`first-${partner.name}-${index}`}
                className="marquee-item transition-all duration-300 hover:scale-105"
              >
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-center w-48 h-24">
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="max-w-full max-h-16 object-contain"
                    style={{ filter: 'grayscale(0%)' }}
                  />
                </div>
              </div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {partnersData.map((partner, index) => (
              <div
                key={`second-${partner.name}-${index}`}
                className="marquee-item transition-all duration-300 hover:scale-105"
              >
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-center w-48 h-24">
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="max-w-full max-h-16 object-contain"
                    style={{ filter: 'grayscale(0%)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Educational Partners Static Section */}
        <div className="mt-12 sm:mt-16">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {['Dar Al-Hekma', 'Dar Al-Fikr', 'Al-Andalus International School', 'Al-Furat International Schools', 'Waad Academy'].map((school, index) => (
              <div
                key={`${school}-${index}`}
                className="bg-gradient-to-r from-primary/5 to-accent/10 rounded-lg px-3 sm:px-6 py-2 sm:py-4 border border-primary/20 hover:border-primary/40 transition-all duration-300"
              >
                <span className="text-primary font-semibold text-sm sm:text-lg whitespace-nowrap">
                  {school}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
