import {Mail, MapPin, Phone} from "lucide-react";
import {cn} from "@/lib/utils";

export type ContactPanelProps = {
    headerClassName?: string;
    className?: string;
}

export default function ContactPanel({className, headerClassName}: ContactPanelProps) {
    return (
        <div className={cn("w-full max-w-3xl", className)}>
            <h2 className={cn("font-[--font-bodoni] font-normal text-[2.5rem] leading-12 text-white mb-10", headerClassName)}>
                Contact.
            </h2>

            <div className="border border-white/10 rounded-xl p-6 bg-[#0D141DCC]">
                {/* Email & Phone row */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-seu-light-gray"/>
                        <span className="font-montserrat font-medium text-lg leading-[1.375rem] text-white">
              Info@Seudevelopment.ge
            </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-seu-light-gray"/>
                        <span className="font-montserrat font-thin text-lg leading-[1.375rem] text-pale-gray">
              +99511333445577
            </span>
                    </div>
                </div>

                {/* PLACEHOLDER: IMAGE - Dark-themed map of Tbilisi, Jikia st. area */}
                <div
                    className="w-full h-[15.625rem] md:h-[18.75rem] rounded-lg bg-seu-dark border border-white/10 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-primary-green"/>
                </div>

                {/* Address */}
                <div className="flex items-center gap-3 mt-6">
                    <MapPin className="w-5 h-5 text-seu-light-gray"/>
                    <span className="font-montserrat font-medium text-lg leading-[1.375rem] text-white">
            Tbilisi Jikia st.
          </span>
                </div>
            </div>
        </div>
    );
}
