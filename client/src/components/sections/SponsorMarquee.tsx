import { useLanguage } from '../../contexts/LanguageContext';
import { partnersData } from '../../data/content';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const SponsorMarquee = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<number | null>(null);

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Get the first item to calculate its actual width
      const firstItem = container.firstElementChild as HTMLElement;
      if (firstItem) {
        const itemWidth = firstItem.offsetWidth;
        // Account for gap-6 (24px) between items
        const gap = 24;
        const totalItemWidth = itemWidth + gap;
        
        container.scrollTo({
          left: index * totalItemWidth,
          behavior: 'smooth'
        });
      }
    }
  };

  const scrollLeft = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : partnersData.length - 1;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const scrollRight = () => {
    const newIndex = currentIndex < partnersData.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  useEffect(() => {
    // Auto-scroll every 6 seconds
    autoScrollRef.current = setInterval(() => {
      scrollRight();
    }, 6000);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [currentIndex]);

  const handleManualScroll = () => {
    // Reset auto-scroll timer when user manually scrolls
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
    autoScrollRef.current = setInterval(() => {
      scrollRight();
    }, 6000);
  };

  return (
    <section className="py-16 bg-white border-t border-gray-100 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-2xl md:text-3xl text-primary mb-4">
            {t('partners.title')}
          </h2>
          <p className="text-gray-600">{t('partners.subtitle')}</p>
        </div>

        {/* Partners Carousel */}
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={() => {
              scrollLeft();
              handleManualScroll();
            }}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg transition-all duration-200 hover:shadow-xl"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <button
            onClick={() => {
              scrollRight();
              handleManualScroll();
            }}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg transition-all duration-200 hover:shadow-xl"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Partners Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-6 px-12 overflow-hidden scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {partnersData.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 w-40 sm:w-48 h-24 sm:h-32 bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center border border-gray-100"
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain"
                  style={{ filter: 'grayscale(0%)' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Educational Partners Static Section */}
        <div className="mt-12 sm:mt-16">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {['Dar Al-Hekma', 'Dar Al-Fikr', 'Al-Andalus International School', 'Al-Furat International Schools', 'Waad Academy'].map((school, index) => (
              <div
                key={`${school}-${index}`}
                className="bg-gradient-to-r from-primary/5 to-accent/10 rounded-lg px-3 sm:px-6 py-2 sm:py-4 border border-primary/20 hover:border-primary/40 transition-all duration-300"
              >
                <span className="text-primary font-semibold text-sm sm:text-lg whitespace-nowrap">
                  {school}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
