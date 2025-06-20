import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe, Menu, X } from 'lucide-react';

import Nawa_Logo from "@assets/Nawa Logo.png";

export const Navigation = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { key: 'nav.home', href: '#home' },
    { key: 'nav.about', href: '#about' },
    { key: 'nav.programs', href: '#programs' },
    { key: 'nav.impact', href: '#impact' },
    { key: 'nav.contact', href: '#contact' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-3">
              <img 
                src={Nawa_Logo} 
                alt="Nawa Logo" 
                className="w-10 h-10"
              />
              <div>
                <h1 className="font-montserrat font-bold text-xl text-primary ml-[9px] mr-[9px]">Nawa</h1>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-8 text-center ml-[25px] mr-[25px]">
              {navItems.map((item, index) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.href)}
                  className={`${
                    index === 0 
                      ? 'text-primary border-b-2 border-accent' 
                      : 'text-gray-700 hover:text-primary'
                  } px-3 py-2 text-sm font-medium ml-[17px] mr-[17px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2`}
                >
                  {t(item.key)}
                </button>
              ))}
            </div>
          </div>

          {/* Language Toggle & CTA */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="text-sm text-gray-600 hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 flex items-center ml-[5px] mr-[5px]"
              aria-label="Switch language"
            >
              <Globe className="w-4 h-4 mr-1" />
              <span className="ml-[9px] mr-[9px]">{t('nav.switchToArabic')}</span>
            </button>
            <button
              onClick={() => scrollToSection('#contact')}
              className="bg-accent text-text-dark px-6 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-400 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              {t('nav.becomeaSponsor')}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.href)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md w-full text-left transition-colors duration-200"
                >
                  {t(item.key)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
