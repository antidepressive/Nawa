import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import ctpImg1 from '@assets/CTP_imgs/1.jpg';
import ctpImg2 from '@assets/CTP_imgs/2.jpg';
import ctpImg3 from '@assets/CTP_imgs/3.jpg';
import ctpImg4 from '@assets/CTP_imgs/4.jpg';
import ctpImg5 from '@assets/CTP_imgs/5.jpg';
import ctpImg6 from '@assets/CTP_imgs/6.jpg';


export const RecentWorks = () => {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSlide, setModalSlide] = useState(0);

  const ctpImages = [
    { src: ctpImg1, alt: 'CTP Program Session 1' },
    { src: ctpImg2, alt: 'CTP Program Session 2' },
    { src: ctpImg3, alt: 'CTP Program Session 3' },
    { src: ctpImg4, alt: 'CTP Program Session 4' },
    { src: ctpImg5, alt: 'CTP Program Session 5' },
    { src: ctpImg6, alt: 'CTP Program Session 6' },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % ctpImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + ctpImages.length) % ctpImages.length);
  };

  const openModal = (index: number) => {
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
    <>
      <section id="recent-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`font-bold text-3xl md:text-4xl text-primary mb-6 ${language === 'ar' ? 'font-cairo' : 'font-montserrat'}`}>
              {language === 'ar' ? 'أعمالنا الحديثة' : 'Recent Works'}
            </h2>
            <p className={`text-lg text-gray-600 max-w-3xl mx-auto ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {language === 'ar' 
                ? 'لقطات من أول برنامج تدريبي استشاري نقوم به في جدة، حيث تعلم المشاركون مهارات الاستشارة العملية من خبراء الصناعة.'
                : 'Moments from our first Consulting Training Program in Jeddah, where participants learned practical consulting skills from industry experts.'
              }
            </p>
          </div>
          
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-96 md:h-[500px] group">
              <img
                src={ctpImages[currentSlide].src}
                alt={ctpImages[currentSlide].alt}
                className="w-full h-full object-cover cursor-pointer transition-all duration-300 ease-in-out"
                onClick={() => openModal(currentSlide)}
              />
              
              {/* Zoom overlay */}
              <div 
                className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                onClick={() => openModal(currentSlide)}
              >
                <ZoomIn className="w-12 h-12 text-white" />
              </div>
              
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className={`absolute top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ${
                  language === 'ar' ? 'right-4' : 'left-4'
                }`}
              >
                {language === 'ar' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
              </button>
              <button
                onClick={nextSlide}
                className={`absolute top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ${
                  language === 'ar' ? 'left-4' : 'right-4'
                }`}
              >
                {language === 'ar' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {ctpImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ${
                      currentSlide === index 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" 
          onClick={closeModal}
        >
          <div className="relative max-w-7xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative">
              <img
                src={ctpImages[modalSlide].src}
                alt={ctpImages[modalSlide].alt}
                className="max-w-full max-h-[90vh] object-contain transition-all duration-300"
              />
              
              {/* Modal Navigation Arrows */}
              <button
                onClick={prevModalSlide}
                className={`absolute top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ${
                  language === 'ar' ? 'right-4' : 'left-4'
                }`}
              >
                {language === 'ar' ? <ChevronRight className="w-8 h-8" /> : <ChevronLeft className="w-8 h-8" />}
              </button>
              <button
                onClick={nextModalSlide}
                className={`absolute top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ${
                  language === 'ar' ? 'left-4' : 'right-4'
                }`}
              >
                {language === 'ar' ? <ChevronLeft className="w-8 h-8" /> : <ChevronRight className="w-8 h-8" />}
              </button>

              {/* Modal Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {ctpImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setModalSlide(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ${
                      modalSlide === index 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
