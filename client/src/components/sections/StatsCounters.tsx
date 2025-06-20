import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { statsData } from '../../data/content';
import backgroundImage from '@assets/background_1750437485135.png';

export const StatsCounters = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState(statsData.map(() => 0));
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          
          // Animate counters
          statsData.forEach((stat, index) => {
            let current = 0;
            const increment = stat.value / 100;
            const timer = setInterval(() => {
              current += increment;
              if (current >= stat.value) {
                current = stat.value;
                clearInterval(timer);
              }
              setCounts(prev => {
                const newCounts = [...prev];
                newCounts[index] = Math.floor(current);
                return newCounts;
              });
            }, 20);
          });
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="py-20 text-white relative overflow-hidden w-full">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/40"></div>
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {statsData.map((stat, index) => (
            <div key={index} className="animate-counter">
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                {counts[index].toLocaleString()}
              </div>
              <div className="text-lg font-medium">{t(stat.label)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
