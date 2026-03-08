import ContactForm from '@/components/ContactForm';
import ContactPanel from '@/components/ContactPanel';

export const LandingContactSection = () => {
  return (
    <div className={'bg-dark-green w-full py-40'}>
      <div className="max-w-[1920px] mx-auto px-10 flex justify-between">
        <ContactForm className={'max-w-2xl'} />
        <ContactPanel className={'max-w-2xl'} />
      </div>
    </div>
  );
};
