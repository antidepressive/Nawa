import { useLanguage } from '../../contexts/LanguageContext';
import { partnersData } from '../../data/content';

export const SponsorMarquee = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-2xl md:text-3xl text-primary mb-4">
            {t('partners.title')}
          </h2>
          <p className="text-gray-600">{t('partners.subtitle')}</p>
        </div>

        <div className="overflow-hidden">
          <div className="flex space-x-12 animate-marquee">
            {[...partnersData, ...partnersData].map((partner, index) => (
              <div
                key={`${partner}-${index}`}
                className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300"
              >
                <div className="w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-300">
                  <span className="text-gray-500 font-semibold text-sm">{partner}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
