import ContactForm from '@/components/ContactForm';
import ContactPanel from '@/components/ContactPanel';

export const SearchContactForm = () => {
  return (
    <div className={'flex justify-between bg-pale-gray p-10'}>
      <ContactForm className={'max-w-2xl'} />
      <ContactPanel className={'max-w-2xl'} />
    </div>
  );
};
