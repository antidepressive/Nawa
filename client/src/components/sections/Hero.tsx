import { useLanguage } from '../../contexts/LanguageContext';
import { Download, Calendar } from 'lucide-react';

export const Hero = () => {
  const { t } = useLanguage();

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-primary">
      {/* Background - Solid Blue Color */}
      <div className="absolute inset-0"></div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-montserrat font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-6 animate-fade-in">
          {t('hero.title')}
        </h1>
        <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto animate-fade-in">
          {t('hero.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <a
            href="/assets/nawa-sponsor.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 inline-flex items-center justify-center"
          >
            <Download className="w-5 h-5 mr-2" />
            {t('hero.downloadDeck')}
          </a>
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
