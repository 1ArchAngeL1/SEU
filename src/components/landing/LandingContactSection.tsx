import ContactForm from '@/components/ContactForm';
import ContactPanel from '@/components/ContactPanel';
import FadeIn from '@/components/FadeIn';

export const LandingContactSection = () => {
  return (
    <div
      className={
        'relative bg-site-bg w-full py-16 lg:py-24 site-noise site-glow-green'
      }
    >
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10 flex flex-col items-center lg:flex-row lg:items-stretch gap-12 lg:gap-16 lg:justify-between">
        <FadeIn direction="left" className="w-full lg:max-w-2xl">
          <ContactForm />
        </FadeIn>
        <FadeIn
          direction="right"
          delay={200}
          className="hidden lg:block lg:max-w-2xl"
        >
          <ContactPanel />
        </FadeIn>
      </div>
    </div>
  );
};
