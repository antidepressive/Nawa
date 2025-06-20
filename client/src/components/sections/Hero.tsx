import { useLanguage } from '../../contexts/LanguageContext';
import { Calendar } from 'lucide-react';
import backgroundImage from '@assets/background_1750437485135.png';

export const Hero = () => {
  const { t } = useLanguage();

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden full-width">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-montserrat md:text-6xl lg:text-7xl text-white mb-6 animate-fade-in font-extrabold text-[96px] ml-[-60px] mr-[-60px]">
          {t('hero.title')}
        </h1>
        <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto animate-fade-in">
          {t('hero.subtitle')}
        </p>

        <div className="flex justify-center animate-fade-in">
          <button
            onClick={scrollToContact}
            className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 inline-flex items-center justify-center"
          >
            <Calendar className="w-5 h-5 mr-2" />
            {t('hero.bookCall')}
          </button>
        </div>
      </div>
    </section>
  );
};