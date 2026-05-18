import LandingHero from '@/components/landing/LandingHero';
import LandingAboutSection from '@/components/landing/LandingAboutSection';
import OngoingSection from '@/components/landing/OngoingSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import LandingAbout from '@/components/landing/LandingAbout';
import SeuPartners from '@/components/landing/SeuPartners';
import { LandingContactSection } from '@/components/landing/LandingContactSection';

export default function Home() {
  return (
    <main className={'bg-site-bg'}>
      <LandingHero />
      <div className="site-divider" />
      <LandingAboutSection />
      <div className="site-divider" />
      <OngoingSection />
      <div className="site-divider" />
      <HowItWorksSection />
      <div className="site-divider" />
      <SeuPartners />
      <div className="site-divider" />
      <LandingAbout />
      <div className="site-divider" />
      <LandingContactSection />
    </main>
  );
}
