import { useLanguage } from '../../contexts/LanguageContext';
import { Linkedin, Twitter, Instagram, Youtube, Phone, Mail, MessageSquare } from 'lucide-react';
import { Link } from 'wouter';
import NawaLogo from '@assets/Nawa Logo.webp';
import FooterBackground from '@assets/background_1750437485135.webp';

export const Footer = () => {
  const { t, language } = useLanguage();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="py-16 w-full relative" style={{ backgroundImage: `url(${FooterBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-6 gap-8">
            {/* Brand */}
            <div className="md:col-span-2 ml-[25px] mr-[25px] mt-[-10px] mb-[-10px] pt-[0px] pb-[0px] pl-[25px] pr-[25px] text-left">
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src={NawaLogo} 
                  alt="Nawa Logo" 
                  className="w-12 h-12"
                />
                <div>
                  <h1 className="font-montserrat font-bold text-2xl text-white">Nawa</h1>
                  <p className="text-white text-sm">شركة نواة الأثر</p>
                </div>
              </div>
              <p className="text-white leading-relaxed mb-6 max-w-md">
                {t('footer.description')}
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.linkedin.com/company/nawa-sa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900 text-[#ffffff] bg-[#008dff]"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://x.com/Nawa_LLC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900 text-[#ffffff] bg-[#008dff]"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/nawa.saudi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900 text-[#ffffff] bg-[#008dff]"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>

              </div>
            </div>

            {/* Contact Information */}
            <div className={`${language === 'ar' ? 'text-right order-4' : 'text-left order-1'}`}>
              <h3 className={`font-montserrat font-bold text-lg mb-4 text-white ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t('footer.contact')}</h3>
              <div className={`space-y-3 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center ${language === 'ar' ? 'justify-start flex-row-reverse space-x-reverse space-x-2' : 'justify-start space-x-2'}`}>
                  <Phone className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-white text-sm">+966 538 104 164</span>
                </div>
                <div className={`flex items-center ${language === 'ar' ? 'justify-start flex-row-reverse space-x-reverse space-x-2' : 'justify-start space-x-2'}`}>
                  <Mail className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-white text-sm">info@nawa.sa</span>
                </div>
                <div className={`flex items-center ${language === 'ar' ? 'justify-start flex-row-reverse space-x-reverse space-x-2' : 'justify-start space-x-2'}`}>
                  <MessageSquare className="w-4 h-4 text-white flex-shrink-0" />
                  <a 
                    href="https://wa.me/966538104164"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-accent transition-colors duration-200 text-sm"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links - Ordered for RTL in Arabic */}
            <div className={`${language === 'ar' ? 'text-right order-3' : 'text-left order-2'}`}>
              <h3 className={`font-montserrat font-bold text-lg mb-4 text-white ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t('footer.quickLinks')}</h3>
              {language === 'ar' ? (
                // Arabic RTL order: الرئيسية، من نحن، الأثر، برامجنا، تواصل معنا
                <ul className="space-y-2 text-right" dir="rtl">
                  <li>
                    <button
                      onClick={() => scrollToSection('#home')}
                      className="text-white hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent text-right w-full block"
                    >
                      {t('nav.home')}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection('#about')}
                      className="text-white hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent text-right w-full block"
                    >
                      {t('nav.about')}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection('#impact')}
                      className="text-white hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent text-right w-full block"
                    >
                      {t('nav.impact')}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection('#programs')}
                      className="text-white hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent text-right w-full block"
                    >
                      {t('nav.programs')}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection('#contact')}
                      className="text-white hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent text-right w-full block"
                    >
                      {t('nav.contact')}
                    </button>
                  </li>
                </ul>
              ) : (
                // English LTR order: Home, About, Impact, Programs, Contact
                <ul className="space-y-2 text-left" dir="ltr">
                  <li>
                    <button
                      onClick={() => scrollToSection('#home')}
                      className="text-white hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent text-left block"
                    >
                      {t('nav.home')}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection('#about')}
                      className="text-white hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent text-left block"
                    >
                      {t('nav.about')}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection('#impact')}
                      className="text-white hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent text-left block"
                    >
                      {t('nav.impact')}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection('#programs')}
                      className="text-white hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent text-left block"
                    >
                      {t('nav.programs')}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection('#contact')}
                      className="text-white hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent text-left block"
                    >
                      {t('nav.contact')}
                    </button>
                  </li>
                </ul>
              )}
            </div>

            {/* Programs - Ordered for RTL in Arabic */}
            <div className={`${language === 'ar' ? 'text-right order-2' : 'text-left order-3'}`}>
              <h3 className={`font-montserrat font-bold text-lg mb-4 text-white ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t('footer.ourPrograms')}</h3>
              <ul className={`space-y-2 ${language === 'ar' ? 'text-right' : 'text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <li>
                  <Link
                    href="/programs/nawa-career"
                    className={`text-white hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent block ${language === 'ar' ? 'text-right' : 'text-left'}`}
                  >
                    {t('programs.career.title')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/programs/nawa-conferences"
                    className={`text-white hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent block ${language === 'ar' ? 'text-right' : 'text-left'}`}
                  >
                    {t('programs.conferences.title')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/programs/saudi-mun-association"
                    className={`text-white hover:text-accent transition-colors duration-200 focus:outline-none focus:text-accent block ${language === 'ar' ? 'text-right' : 'text-left'}`}
                  >
                    {t('programs.mun.title')}
                  </Link>
                </li>
                
              </ul>
            </div>


          </div>

          <div className="border-t border-gray-300 mt-12 pt-8 flex flex-col md:flex-row justify-center items-center">
            <p className="text-white text-[18px]">{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
  );
};
