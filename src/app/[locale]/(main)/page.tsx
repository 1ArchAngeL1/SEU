import LandingHero from '@/components/landing/LandingHero';
import LandingAboutSection from '@/components/landing/LandingAboutSection';
import OngoingSection from '@/components/landing/OngoingSection';
import UpcomingSection from '@/components/landing/UpcomingSection';
import LandingAbout from '@/components/landing/LandingAbout';
import SeuPartners from '@/components/landing/SeuPartners';
import { LandingContactSection } from '@/components/landing/LandingContactSection';

export default function Home() {
  return (
    <main>
      <LandingHero />
      <LandingAboutSection />
      <OngoingSection />
      <UpcomingSection />
      <SeuPartners />
      <LandingAbout />
      <LandingContactSection />
      {/*<AboutCompany />*/}
      {/*<Ongoing />*/}
      {/*<SeuVajaLight />*/}
      {/*<SeuVajaDark />*/}
      {/*<Upcoming />*/}
      {/*<Partners />*/}
    </main>
  );
}
