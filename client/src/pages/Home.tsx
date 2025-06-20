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
import { ScrollbarDemo } from '../components/ui/ScrollbarDemo';

export default function Home() {
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
      <SponsorMarquee />
      <div className="py-8 bg-gray-100">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <ScrollbarDemo />
        </div>
      </div>
      <NewsletterSignup />
      <Contact />
      <Footer />
      <ScrollToTop />
    </>
  );
}
