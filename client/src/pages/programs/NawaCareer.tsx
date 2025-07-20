import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Calendar, Users, Target, BookOpen, Globe, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import backgroundImage from '@assets/background_1750437485135.png';
import ctpImg1 from '@assets/CTP_imgs/DSC01302.JPG';
import ctpImg2 from '@assets/CTP_imgs/DSC01910.JPG';
import ctpImg3 from '@assets/CTP_imgs/DSC02174.JPG';
import ctpImg4 from '@assets/CTP_imgs/DSC02394.JPG';
import ctpImg5 from '@assets/CTP_imgs/IMG_0032.jpeg';
import ctpImg6 from '@assets/CTP_imgs/IMG_0035.jpeg';
import ctpImg7 from '@assets/CTP_imgs/IMG_9947 - frame at 0m5s.jpg';

export default function NawaCareer() {
  const { t, language, toggleLanguage } = useLanguage();
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const ctpImages = [
    { src: ctpImg1, alt: 'CTP Program Session 1' },
    { src: ctpImg2, alt: 'CTP Program Session 2' },
    { src: ctpImg3, alt: 'CTP Program Session 3' },
    { src: ctpImg4, alt: 'CTP Program Session 4' },
    { src: ctpImg5, alt: 'CTP Program Session 5' },
    { src: ctpImg6, alt: 'CTP Program Session 6' },
    { src: ctpImg7, alt: 'CTP Program Session 7' }
  ];

  useEffect(() => {
    document.title = 'Nawa - نَوَاة';
    window.scrollTo(0, 0);
  }, []);

  const navigateToContact = () => {
    setLocation('/');
    // Use setTimeout to ensure navigation completes before scrolling
    setTimeout(() => {
      const element = document.querySelector('#contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % ctpImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + ctpImages.length) % ctpImages.length);
  };

  // Modal state for expanded image view
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSlide, setModalSlide] = useState(0);

  const openModal = (index) => {
    setModalSlide(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextModalSlide = () => {
    setModalSlide((prev) => (prev + 1) % ctpImages.length);
  };

  const prevModalSlide = () => {
    setModalSlide((prev) => (prev - 1 + ctpImages.length) % ctpImages.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="text-white py-20 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-blue-600/80"></div>
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home Button and Language Toggle */}
          <div className="mb-8 flex justify-between items-center">
            <Link href="/">
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'العودة إلى الرئيسية' : 'Back to Home'}
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={toggleLanguage}
            >
              <Globe className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'EN' : 'العربية'}
            </Button>
          </div>
          <div className="text-center">
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl mb-6">
              {t('programs.career.title')}
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              {t('programs.career.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-16">
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          <div className="mb-12">
            <h2 className={`font-bold text-3xl text-primary mb-6 ${language === 'ar' ? 'font-cairo' : 'font-montserrat'}`}>
              {t('career.heroTitle')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('career.heroDescription')}
            </p>
          </div>

          {/* Program Outcomes */}
          <div className="mb-12">
            <h3 className={`font-bold text-2xl text-primary mb-6 ${language === 'ar' ? 'font-cairo' : 'font-montserrat'}`}>
              {t('career.outcomesTitle')}
            </h3>
            <ul className="space-y-4">
              <li className={`flex items-start ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0 ${language === 'ar' ? 'ml-4' : 'mr-4'}`}></div>
                <span className="text-gray-700">
                  {t('career.outcome1')}
                </span>
              </li>
              <li className={`flex items-start ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0 ${language === 'ar' ? 'ml-4' : 'mr-4'}`}></div>
                <span className="text-gray-700">
                  {t('career.outcome2')}
                </span>
              </li>
              <li className={`flex items-start ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0 ${language === 'ar' ? 'ml-4' : 'mr-4'}`}></div>
                <span className="text-gray-700">
                  {t('career.outcome3')}
                </span>
              </li>
              <li className={`flex items-start ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0 ${language === 'ar' ? 'ml-4' : 'mr-4'}`}></div>
                <span className="text-gray-700">
                  {t('career.outcome4')}
                </span>
              </li>
            </ul>
          </div>

          {/* Current Programs */}
          <div className="mb-12">
            <h3 className={`font-bold text-2xl text-primary mb-8 ${language === 'ar' ? 'font-cairo text-center' : 'font-montserrat text-center'}`}>
              {language === 'ar' ? 'البرامج الحالية' : 'Current Programs'}
            </h3>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-bold text-xl text-gray-900 mb-3 ${language === 'ar' ? 'font-cairo text-right' : 'font-montserrat'}`}>
                    {language === 'ar' ? 'برنامج التدريب الاستشاري' : 'Consulting Training Program'}
                  </h4>
                  
                  <p className={`text-gray-600 mb-4 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {language === 'ar' 
                      ? 'برنامج تدريبي مكثف لمدة 12 يوماً في جدة مصمم لإعدادك لمهنة استشارية حقيقية. تعلم مباشرة من خبراء في شركات رائدة مثل KPMG وPure Consulting وTAM.'
                      : 'A 12-day intensive bootcamp in Jeddah designed to prepare you for a real consulting career. Learn directly from experts at leading companies like KPMG, Pure Consulting, and TAM.'
                    }
                  </p>
                  
                  <div className={`flex flex-wrap gap-4 mb-6 ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex items-center gap-2 text-primary">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {language === 'ar' ? '12 يوم مكثف' : '12 days intensive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {language === 'ar' ? 'خبراء من الشركات الرائدة' : 'Industry experts'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <Target className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {language === 'ar' ? 'جدة' : 'Jeddah'}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`flex flex-col sm:flex-row gap-3 ${language === 'ar' ? 'sm:justify-end' : 'sm:justify-start'}`}>
                    <Link href="/programs/consulting-training-program">
                      <Button className="bg-primary hover:bg-blue-700 text-white">
                        {language === 'ar' ? 'تعرف على المزيد' : 'Learn More'}
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                      onClick={() => window.open('https://forms.gle/7NQp3AcjNsHqg5Bt9', '_blank', 'noopener,noreferrer')}
                    >
                      {language === 'ar' ? 'سجل الآن' : 'Register Now'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTP Program Images Slideshow */}
          <div className="mb-12">
            <h3 className={`font-bold text-2xl text-primary mb-8 ${language === 'ar' ? 'font-cairo text-center' : 'font-montserrat text-center'}`}>
              {language === 'ar' ? 'صور من البرنامج التدريبي الاستشاري الأول' : 'Highlights from First CTP Program'}
            </h3>
            
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-96 md:h-[500px] group">
                <img
                  src={ctpImages[currentSlide].src}
                  alt={ctpImages[currentSlide].alt}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => openModal(currentSlide)}
                />
                
                {/* Zoom overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
                     onClick={() => openModal(currentSlide)}>
                  <ZoomIn className="w-12 h-12 text-white" />
                </div>
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className={`absolute top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 ${language === 'ar' ? 'right-4' : 'left-4'}`}
                >
                  {language === 'ar' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                </button>
                <button
                  onClick={nextSlide}
                  className={`absolute top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 ${language === 'ar' ? 'left-4' : 'right-4'}`}
                >
                  {language === 'ar' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {ctpImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        currentSlide === index 
                          ? 'bg-white' 
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Slideshow Caption */}
              <div className="p-6 text-center">
                <p className="text-gray-600">
                  {language === 'ar' 
                    ? 'لقطات من أول برنامج تدريبي استشاري نقوم به في جدة، حيث تعلم المشاركون مهارات الاستشارة العملية من خبراء الصناعة.'
                    : 'Moments from our first Consulting Training Program in Jeddah, where participants learned practical consulting skills from industry experts.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Sponsor CTA */}
          <div className={`bg-gray-50 rounded-xl p-8 ${language === 'ar' ? 'text-center' : 'text-center'}`}>
            <h3 className={`font-bold text-2xl text-primary mb-4 ${language === 'ar' ? 'font-cairo' : 'font-montserrat'}`}>
              {t('career.sponsorTitle')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('career.sponsorDescription')}
            </p>
            <Button onClick={navigateToContact} size="lg" className="bg-primary hover:bg-primary/90">
              {t('career.sponsorButton')}
            </Button>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="relative max-w-7xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative">
              <img
                src={ctpImages[modalSlide].src}
                alt={ctpImages[modalSlide].alt}
                className="max-w-full max-h-[90vh] object-contain"
              />
              
              {/* Modal Navigation Arrows */}
              <button
                onClick={prevModalSlide}
                className={`absolute top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 ${language === 'ar' ? 'right-4' : 'left-4'}`}
              >
                {language === 'ar' ? <ChevronRight className="w-8 h-8" /> : <ChevronLeft className="w-8 h-8" />}
              </button>
              <button
                onClick={nextModalSlide}
                className={`absolute top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 ${language === 'ar' ? 'left-4' : 'right-4'}`}
              >
                {language === 'ar' ? <ChevronLeft className="w-8 h-8" /> : <ChevronRight className="w-8 h-8" />}
              </button>

              {/* Modal Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {ctpImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setModalSlide(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-200 ${
                      modalSlide === index 
                        ? 'bg-white' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
