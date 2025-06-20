import { Navigation } from '../components/sections/Navigation';
import { Hero } from '../components/sections/Hero';
import { ElevatorPitch } from '../components/sections/ElevatorPitch';
import { StatsCounters } from '../components/sections/StatsCounters';
import { ProgramsGrid } from '../components/sections/ProgramsGrid';
import { SponsorMarquee } from '../components/sections/SponsorMarquee';
import { NewsletterSignup } from '../components/sections/NewsletterSignup';
import { Contact } from '../components/sections/Contact';
import { Footer } from '../components/sections/Footer';
import { ScrollToTop } from '../components/ui/ScrollToTop';

export default function Home() {
  return (
    <>
      <Navigation />
      <Hero />
      <ElevatorPitch />
      <StatsCounters />
      <ProgramsGrid />
      <SponsorMarquee />
      <NewsletterSignup />
      <Contact />
      <Footer />
      <ScrollToTop />
    </>
  );
}
