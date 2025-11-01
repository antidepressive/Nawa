import { useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '../components/ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { Navigation } from '../components/sections/Navigation';
import { Hero } from '../components/sections/Hero';
import { ElevatorPitch } from '../components/sections/ElevatorPitch';
import { StatsCounters } from '../components/sections/StatsCounters';
import { ProgramsGrid } from '../components/sections/ProgramsGrid';
import { RecentWorks } from '../components/sections/RecentWorks';
import { SponsorMarquee } from '../components/sections/SponsorMarquee';
import { NewsletterSignup } from '../components/sections/NewsletterSignup';
import { Contact } from '../components/sections/Contact';
import { Footer } from '../components/sections/Footer';
import { ScrollToTop } from '../components/ui/ScrollToTop';

export default function Home() {
  const { t } = useLanguage();
  useEffect(() => {
    document.title = 'Nawa - نَوَاة';
  }, []);
  return (
    <>
      <Navigation />
      <section id="home">
        <Hero />
      </section>
      <section id="about">
        <ElevatorPitch />
      </section>
      <section id="impact">
        <StatsCounters />
      </section>
      <ProgramsGrid />
      <RecentWorks />
      <SponsorMarquee />
      {/* Join Our Team CTA */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 text-center">
          <Link href="/careers">
            <Button className="bg-accent text-text-dark hover:bg-yellow-400">
              {t('careers.title')}
            </Button>
          </Link>
        </div>
      </section>
      <NewsletterSignup />
      <Contact />
      <Footer />
      <ScrollToTop />
    </>
  );
}
