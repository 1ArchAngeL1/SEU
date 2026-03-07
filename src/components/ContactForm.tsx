"use client";

import {useState} from "react";
import {cn} from "@/lib/utils";

export type ContactFormProps = {
    className?: string;
}

export default function ContactForm({className}: ContactFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        setFormData({name: "", phone: "", email: ""});
    };

    return (
        <div className={cn("w-full max-w-3xl", className)}>
            <h2 className="font-[--font-bodoni] font-normal text-[2.5rem] leading-12 text-white mb-10">
                Requests Call.
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-secondary-grey/40 border border-pale-gray rounded-xl px-6 py-4 font-montserrat font-medium text-base text-white placeholder-white focus:outline-none focus:border-white/40 transition-colors"
                />
                <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-secondary-grey/40 border border-pale-gray rounded-xl px-6 py-4 font-montserrat font-medium text-base text-white placeholder-white focus:outline-none focus:border-white/40 transition-colors"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-secondary-grey/40 border border-pale-gray rounded-xl px-6 py-4 font-montserrat font-medium text-base text-white placeholder-white focus:outline-none focus:border-white/40 transition-colors"
                />

                <div className="mt-4">
                    <button
                        type="submit"
                        className="bg-primary-green text-white font-montserrat font-medium text-lg px-10 py-4 rounded-xl hover:bg-primary-green/85 transition-colors"
                    >
                        Contact
                    </button>
                </div>
            </form>
        </div>
    );
}
