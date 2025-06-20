
import { useLanguage } from '../../contexts/LanguageContext';
import backgroundImage from '@assets/background_1750437485135.png';

export const StayInTouch = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 text-white relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">{t('contact.title')}</h2>
        <p className="mb-8">{t('contact.subtitle')}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              const element = document.querySelector('#contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {t('contact.letsConnect')}
          </button>
        </div>
      </div>
    </section>
  );
};
