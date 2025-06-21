import { useLanguage } from '../../contexts/LanguageContext';
import { partnersData } from '../../data/content';

export const SponsorMarquee = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-white border-t border-gray-100 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-2xl md:text-3xl text-primary mb-4">
            {t('partners.title')}
          </h2>
          <p className="text-gray-600">{t('partners.subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
          {partnersData.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 transition-all duration-300"
            >
              <div className="w-24 h-24 bg-white rounded-full border border-gray-200 flex items-center justify-center hover:shadow-lg transition-all duration-300 overflow-hidden">
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Educational Partners Scrolling Section */}
        <div className="mt-12 sm:mt-16">
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll">
              <div className="flex space-x-4 sm:space-x-8 shrink-0">
                {['Dar Al-Hekma', 'Dar Al-Fikr', 'Al-Andalus International School', 'Al-Furat International Schools', 'Waad Academy'].map((school, index) => (
                  <div
                    key={`${school}-${index}`}
                    className="flex-shrink-0 bg-gradient-to-r from-primary/5 to-accent/10 rounded-lg px-3 sm:px-6 py-2 sm:py-4 border border-primary/20 hover:border-primary/40 transition-all duration-300"
                  >
                    <span className="text-primary font-semibold text-sm sm:text-lg whitespace-nowrap">
                      {school}
                    </span>
                  </div>
                ))}
              </div>
              {/* Duplicate for seamless loop */}
              <div className="flex space-x-4 sm:space-x-8 shrink-0 ml-4 sm:ml-8">
                {['Dar Al-Hekma', 'Dar Al-Fikr', 'Al-Andalus International School', 'Al-Furat International Schools', 'Waad Academy'].map((school, index) => (
                  <div
                    key={`${school}-duplicate-${index}`}
                    className="flex-shrink-0 bg-gradient-to-r from-primary/5 to-accent/10 rounded-lg px-3 sm:px-6 py-2 sm:py-4 border border-primary/20 hover:border-primary/40 transition-all duration-300"
                  >
                    <span className="text-primary font-semibold text-sm sm:text-lg whitespace-nowrap">
                      {school}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
