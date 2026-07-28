import LandingHero from '@/components/landing/LandingHero';
import LandingAboutSection from '@/components/landing/LandingAboutSection';
import OngoingSection from '@/components/landing/OngoingSection';
import FinishedSection from '@/components/landing/FinishedSection';
import LandingAbout from '@/components/landing/LandingAbout';
import LandingPartnersSection from '@/components/landing/LandingPartnersSection';
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
      <FinishedSection />
      {/*<div className="site-divider" />*/}
      {/*<HowItWorksSection />*/}
      <div className="site-divider" />
      <LandingPartnersSection />
      <div className="site-divider" />
      <LandingAbout />
      <div className="site-divider" />
      <LandingContactSection />
    </main>
  );
}
