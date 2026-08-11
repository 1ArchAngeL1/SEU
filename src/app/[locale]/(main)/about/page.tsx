import AboutHero from '@/components/about/AboutHero';
import AboutMission from '@/components/about/AboutMission';
import AboutHiring from '@/components/about/AboutHiring';
import LandingPartnersSection from '@/components/landing/LandingPartnersSection';
import ContactForm from '@/components/ContactForm';
import ContactPanel from '@/components/ContactPanel';

export default function AboutPage() {
  return (
    <main>
      {/* Hero + Mission */}
      <div className="bg-site-bg">
        <AboutHero />
        <AboutMission />
      </div>

      {/* Hiring */}
      <AboutHiring />

      {/* Partners + Contact */}
      <div className="bg-site-bg">
        <LandingPartnersSection />

        {/* Contact Section */}
        <div className="py-20 lg:py-28 border-t border-site-border">
          <div className="max-w-[1920px] mx-auto px-5 lg:px-10 flex flex-col lg:flex-row justify-between gap-12">
            <ContactForm className="max-w-3xl" headerClassName="text-right" />
            <ContactPanel className="max-w-3xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
