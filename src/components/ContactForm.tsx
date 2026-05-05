'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ContactFormProps = {
  className?: string;
};

export default function ContactForm({ className }: ContactFormProps) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // PLACEHOLDER: API - seu-backend has no /contacts endpoint yet.
    // Wire this to the real API when it ships.
    await new Promise((r) => setTimeout(r, 500));

    setSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', phone: '', email: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className={cn('w-full max-w-3xl', className)}>
      <h2 className="font-[--font-bodoni] font-normal text-seu-heading-lg leading-12 text-white mb-10">
        Requests Call.
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full bg-secondary-grey/40 border border-pale-gray rounded-xl px-6 py-3 font-montserrat font-medium text-seu-body-sm text-white placeholder-white focus:outline-none focus:border-white/40 transition-colors"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          className="w-full bg-secondary-grey/40 border border-pale-gray rounded-xl px-6 py-3 font-montserrat font-medium text-seu-body-sm text-white placeholder-white focus:outline-none focus:border-white/40 transition-colors"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full bg-secondary-grey/40 border border-pale-gray rounded-xl px-6 py-3 font-montserrat font-medium text-seu-body-sm text-white placeholder-white focus:outline-none focus:border-white/40 transition-colors"
        />

        <div className="mt-4 flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary-orange text-white font-montserrat font-medium text-seu-body px-14 py-3 rounded-xl hover:bg-primary-orange/85 transition-colors disabled:opacity-60"
          >
            {submitting ? 'Sending…' : 'Contact'}
          </button>
          {submitted && (
            <span className="flex items-center gap-2 text-emerald-400 font-montserrat text-seu-caption">
              <CheckCircle2 className="size-4" />
              Thanks — we'll be in touch
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
