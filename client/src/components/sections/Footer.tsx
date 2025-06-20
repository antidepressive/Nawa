import { useLanguage } from '../../contexts/LanguageContext';
import { Linkedin, Twitter, Instagram, Youtube, Download, Handshake } from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => scrollToSection('#contact');

  return (
    <>
      {/* CTA Banner */}
      <section className="py-16 bg-accent text-text-dark">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToContact}
              className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 inline-flex items-center justify-center"
            >
              <Handshake className="w-5 h-5 mr-2" />
              {t('nav.becomeaSponsor')}
            </button>
            <a
              href="/assets/nawa-sponsor.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-text-dark px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 inline-flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              {t('hero.downloadDeck')}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text-dark text-white py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="/assets/nawa-logo.svg" 
                  alt="Nawa Logo" 
                  className="w-12 h-12"
                />
                <div>
                  <h1 className="font-montserrat font-bold text-2xl text-white">Nawa</h1>
                  <p className="text-gray-400 text-sm">شركة نواة الأثر</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                {t('footer.description')}
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-700 hover:bg-primary rounded-lg flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-700 hover:bg-primary rounded-lg flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-700 hover:bg-primary rounded-lg flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-700 hover:bg-primary rounded-lg flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">{t('footer.quickLinks')}</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection('#home')}
                    className="text-gray-300 hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent"
                  >
                    {t('nav.home')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('#about')}
                    className="text-gray-300 hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent"
                  >
                    {t('nav.about')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('#programs')}
                    className="text-gray-300 hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent"
                  >
                    {t('nav.programs')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('#impact')}
                    className="text-gray-300 hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent"
                  >
                    {t('nav.impact')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('#contact')}
                    className="text-gray-300 hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent"
                  >
                    {t('nav.contact')}
                  </button>
                </li>
              </ul>
            </div>

            {/* Programs */}
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">{t('footer.ourPrograms')}</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection('#career-details')}
                    className="text-gray-300 hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent"
                  >
                    {t('programs.career.title')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('#conferences-details')}
                    className="text-gray-300 hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent"
                  >
                    {t('programs.conferences.title')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('#mun-details')}
                    className="text-gray-300 hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent"
                  >
                    {t('programs.mun.title')}
                  </button>
                </li>
                <li>
                  <a
                    href="/assets/impact-2025.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent"
                  >
                    Impact Report
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">{t('footer.copyright')}</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy-policy" className="text-gray-400 hover:text-accent text-sm transition-colors duration-200">
                {t('footer.privacy')}
              </a>
              <a href="/terms-of-service" className="text-gray-400 hover:text-accent text-sm transition-colors duration-200">
                {t('footer.terms')}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
