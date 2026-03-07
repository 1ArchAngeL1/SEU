import { Mail, MapPin, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ContactPanelProps = {
  headerClassName?: string;
  className?: string;
};

export default function ContactPanel({
  className,
  headerClassName,
}: ContactPanelProps) {
  return (
    <div className={cn('w-full', className)}>
      <h2
        className={cn(
          'font-[--font-bodoni] font-normal text-seu-heading-lg leading-tight mb-8',
          headerClassName
        )}
      >
        Contact.
      </h2>

      <div className="border border-secondary-black rounded-xl p-6 bg-dark-green">
        {/* Email & Phone row */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-6">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-secondary-grey" />
            <span className="font-montserrat font-medium text-seu-body-sm leading-[1.375rem] text-pale-gray">
              Info@Seudevelopment.ge
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-secondary-grey" />
            <span className="font-montserrat font-normal text-seu-body-sm leading-[1.375rem] text-pale-gray">
              +995 511 333 445
            </span>
          </div>
        </div>

        {/* PLACEHOLDER: IMAGE - Dark-themed map of Tbilisi, Jikia st. area */}
        <div className="w-full h-48 md:h-56 rounded-lg bg-dark-green/80 border border-secondary-black flex items-center justify-center">
          <MapPin className="w-8 h-8 text-primary-green" />
        </div>

        {/* Address */}
        <div className="flex items-center gap-3 mt-6">
          <MapPin className="w-5 h-5 text-secondary-grey" />
          <span className="font-montserrat font-medium text-seu-body-sm leading-[1.375rem] text-pale-gray">
            Tbilisi, Jikia st.
          </span>
        </div>
      </div>
    </div>
  );
}
