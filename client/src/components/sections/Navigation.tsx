import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe, Menu, X } from 'lucide-react';
import { Link } from 'wouter';

import Nawa_Logo from "@assets/Nawa Logo.webp";

export const Navigation = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { key: 'nav.home', href: '#home', isLink: false },
    { key: 'nav.about', href: '#about', isLink: false },
    { key: 'nav.impact', href: '#impact', isLink: false },
    { key: 'nav.programs', href: '/programs/nawa-career', isLink: true },
    { key: 'nav.contact', href: '#contact', isLink: false }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="absolute top-0 z-50 bg-transparent w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center h-16">
          {/* Brand Block - Always on left */}
          <div className="flex-shrink-0 flex items-center">
            <img 
              src={Nawa_Logo} 
              alt="Nawa Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
            <div className={language === 'ar' ? 'mr-2 sm:mr-3' : 'ml-2 sm:ml-3'}>
              <h1 className="font-montserrat text-white font-extrabold text-lg sm:text-xl md:text-2xl px-2">
                {language === 'ar' ? 'نواة' : 'Nawa'}
              </h1>
            </div>
          </div>

          {/* Navigation Menu - Absolutely centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="hidden md:flex items-baseline gap-8 ml-[0px] mr-[0px] pl-[0px] pr-[0px] mt-[0px] mb-[0px] pt-[0px] pb-[0px] text-justify">
              {navItems.map((item, index) => (
                item.isLink ? (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`${
                      index === 0 
                        ? 'text-white border-b-2 border-accent' 
                        : 'text-white/80 hover:text-white'
                    } px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 whitespace-nowrap`}
                  >
                    {t(item.key)}
                  </Link>
                ) : (
                  <button
                    key={item.key}
                    onClick={() => scrollToSection(item.href)}
                    className={`${
                      index === 0 
                        ? 'text-white border-b-2 border-accent' 
                        : 'text-white/80 hover:text-white'
                    } px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 whitespace-nowrap`}
                  >
                    {t(item.key)}
                  </button>
                )
              ))}
            </div>
          </div>

          {/* Action Block - Always on right */}
          <div className="flex-shrink-0 flex items-center gap-2 sm:gap-4 ml-auto">
            <button
              onClick={toggleLanguage}
              className="text-xs sm:text-sm text-white/80 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 flex items-center px-2 py-1 ml-[0px] mr-[0px] pl-[0px] pr-[0px] mt-[0px] mb-[0px] pt-[0px] pb-[0px] text-justify"
              aria-label="Switch language"
            >
              <Globe className={`w-3 h-3 sm:w-4 sm:h-4 ${language === 'ar' ? 'ml-1' : 'mr-1'} hidden sm:inline`} />
              <span className="sm:hidden">
                {language === 'ar' ? 'English' : 'العربية'}
              </span>
              <span className="hidden sm:inline">{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>
            <button
              onClick={() => scrollToSection('#contact')}
              className="bg-accent text-text-dark px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm hover:bg-yellow-400 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 whitespace-nowrap"
            >
              {t('nav.becomeaSponsor')}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/30 backdrop-blur-sm border-t border-white/20">
              {navItems.map((item) => (
                item.isLink ? (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-md w-full text-left transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                ) : (
                  <button
                    key={item.key}
                    onClick={() => scrollToSection(item.href)}
                    className="block px-3 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-md w-full text-left transition-colors duration-200"
                  >
                    {t(item.key)}
                  </button>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
