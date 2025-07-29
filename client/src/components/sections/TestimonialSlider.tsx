import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SectionHeading } from '../ui/SectionHeading';
import { testimonialsData } from '../../data/content';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export const TestimonialSlider = () => {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const totalSlides = testimonialsData.length;

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isTransitioning]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTransitioning]);

  return (
    <section className="py-20 bg-gradient-to-br from-bg-light to-accent-light">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t('testimonials.title')}
          subtitle={t('testimonials.subtitle')}
        />

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonialsData.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0">
                  <div className="glass-card rounded-2xl p-6 sm:p-8 md:p-12 text-center shadow-xl">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 sm:mb-6 object-cover border-4 border-accent"
                    />
                    <blockquote className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-4 sm:mb-6 italic leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="text-primary font-semibold text-lg">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.position}</div>
                    <div className="flex justify-center mt-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-accent fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className={`absolute top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
              language === 'ar' ? 'right-4' : 'left-4'
            } ${isTransitioning ? 'pointer-events-none opacity-50' : ''}`}
            disabled={isTransitioning}
            aria-label="Previous testimonial"
          >
            {language === 'ar' ? <ChevronRight className="w-5 h-5 text-primary" /> : <ChevronLeft className="w-5 h-5 text-primary" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className={`absolute top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
              language === 'ar' ? 'left-4' : 'right-4'
            } ${isTransitioning ? 'pointer-events-none opacity-50' : ''}`}
            disabled={isTransitioning}
            aria-label="Next testimonial"
          >
            {language === 'ar' ? <ChevronLeft className="w-5 h-5 text-primary" /> : <ChevronRight className="w-5 h-5 text-primary" />}
          </button>

          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                  index === currentSlide ? 'bg-accent scale-125' : 'bg-gray-300 hover:bg-accent'
                } ${isTransitioning ? 'pointer-events-none' : ''}`}
                disabled={isTransitioning}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
