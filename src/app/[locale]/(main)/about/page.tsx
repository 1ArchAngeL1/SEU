import AboutHero from '@/components/about/AboutHero';
import AboutMission from '@/components/about/AboutMission';
import AboutTeam from '@/components/about/AboutTeam';
import AboutHiring from '@/components/about/AboutHiring';
import AboutPartners from '@/components/about/AboutPartners';
import ContactForm from '@/components/ContactForm';
import ContactPanel from '@/components/ContactPanel';

export default function AboutPage() {
  return (
    <main>
      {/* Hero + Mission + Team */}
      <div className="bg-site-bg">
        <AboutHero />
        <AboutMission />
        <AboutTeam />
      </div>

      {/* Hiring */}
      <AboutHiring />

      {/* Partners + Contact */}
      <div className="bg-site-bg">
        <AboutPartners />

        {/* Contact Section */}
        <div className="py-20 lg:py-28 border-t border-site-border">
          <div className="max-w-[1920px] mx-auto px-5 lg:px-10 flex flex-col lg:flex-row justify-between gap-12">
            <ContactForm className="max-w-2xl" />
            <ContactPanel className="max-w-2xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
