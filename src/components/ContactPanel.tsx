import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPanel() {
  return (
    <div className="w-full max-w-3xl">
      <h2 className="font-[--font-bodoni] font-normal text-[2.5rem] leading-12 text-white mb-8">
        Contact.
      </h2>

      <div className="border border-white/10 rounded-xl bg-white/5 p-6">
        {/* Email & Phone row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-seu-light-gray" />
            <span className="font-montserrat font-medium text-lg leading-[1.375rem] text-white">
              Info@Seudevelopment.ge
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-seu-light-gray" />
            <span className="font-montserrat font-thin text-lg leading-[1.375rem] text-pale-gray">
              +99511333445577
            </span>
          </div>
        </div>

        {/* PLACEHOLDER: IMAGE - Dark-themed map of Tbilisi, Jikia st. area */}
        <div className="w-full h-[15.625rem] md:h-[18.75rem] rounded-lg bg-seu-dark border border-white/10 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-primary-green" />
        </div>

        {/* Address */}
        <div className="flex items-center gap-3 mt-6">
          <MapPin className="w-5 h-5 text-seu-light-gray" />
          <span className="font-montserrat font-medium text-lg leading-[1.375rem] text-white">
            Tbilisi Jikia st.
          </span>
        </div>
      </div>
    </div>
  );
}
