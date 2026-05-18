import ContactForm from '@/components/ContactForm';
import ContactPanel from '@/components/ContactPanel';
import FadeIn from '@/components/FadeIn';

export const LandingContactSection = () => {
  return (
    <div className={'relative bg-site-bg w-full py-16 lg:py-24 site-noise site-glow-orange'}>
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10 flex flex-col lg:flex-row gap-12 lg:gap-0 lg:justify-between">
        <FadeIn direction="left">
          <ContactForm className={'max-w-2xl'} />
        </FadeIn>
        <FadeIn direction="right" delay={200} className="hidden lg:block">
          <ContactPanel className={'max-w-2xl'} />
        </FadeIn>
      </div>
    </div>
  );
};
