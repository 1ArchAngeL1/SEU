import LandingHero from '@/components/landing/LandingHero';
import LandingAboutSection from '@/components/landing/LandingAboutSection';
import OngoingSection from '@/components/landing/OngoingSection';
import LandingAbout from '@/components/landing/LandingAbout';
import SeuPartners from '@/components/landing/SeuPartners';
import { LandingContactSection } from '@/components/landing/LandingContactSection';

export default function Home() {
  return (
    <main className={'bg-site-bg'}>
      <LandingHero />
      <LandingAboutSection />
      <OngoingSection />
      <SeuPartners />
      <LandingAbout />
      <LandingContactSection />
    </main>
  );
}
