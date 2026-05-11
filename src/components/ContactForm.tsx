'use client';

import { useState } from 'react';
import { CheckCircle2, User, Phone, Mail, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export type ContactFormProps = {
  className?: string;
  variant?: 'default' | 'mobile-diagonal';
};

export default function ContactForm({
  className,
  variant = 'default',
}: ContactFormProps) {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone.trim()) return;
    setSubmitting(true);

    // PLACEHOLDER: API - seu-backend has no /contacts endpoint yet.
    await new Promise((r) => setTimeout(r, 500));

    setSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', phone: '', email: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const inputBase =
    'w-full bg-white/[0.08] border border-white/10 rounded-xl pl-12 pr-6 py-4 font-montserrat font-medium text-seu-body-sm text-white placeholder-pale-gray/50 focus:outline-none focus:border-primary-orange/60 focus:ring-1 focus:ring-primary-orange/20 transition-all';

  return (
    <div className={cn('w-full', className)}>
      {/* Heading */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-0.5 rounded-full bg-primary-orange" />
          <span className="font-montserrat font-semibold text-seu-caption-sm uppercase tracking-[0.2em] text-primary-orange">
            {t('submit')}
          </span>
        </div>
        <h2
          className={cn(
            'font-[--font-bodoni] font-normal text-seu-title lg:text-seu-title-lg leading-none',
            variant === 'mobile-diagonal' ? 'text-dark-green' : 'text-white'
          )}
        >
          {t('requestsCall')}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 w-[min(100%,20rem)] lg:w-[28rem]"
      >
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 size-5 grid place-items-center pointer-events-none">
            <User className="size-5 text-secondary-grey group-focus-within:text-primary-orange transition-colors" />
          </span>
          <input
            type="text"
            placeholder={t('namePlaceholder')}
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className={inputBase}
          />
        </div>

        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 size-5 grid place-items-center pointer-events-none">
            <Phone className="size-5 text-secondary-grey group-focus-within:text-primary-orange transition-colors" />
          </span>
          <input
            type="tel"
            placeholder={t('phonePlaceholder')}
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
            className={inputBase}
          />
        </div>

        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 size-5 grid place-items-center pointer-events-none">
            <Mail className="size-5 text-secondary-grey group-focus-within:text-primary-orange transition-colors" />
          </span>
          <input
            type="email"
            placeholder={t('emailPlaceholder')}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={inputBase}
          />
        </div>

        <div className="mt-2 flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-3 bg-primary-orange text-white font-montserrat font-medium text-seu-body px-10 py-3.5 rounded-xl shadow-lg shadow-primary-orange/25 hover:shadow-xl hover:shadow-primary-orange/30 hover:bg-primary-orange/90 active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {submitting ? t('sending') : t('submit')}
            <Send className="size-4" />
          </button>

          {submitted && (
            <span className="flex items-center gap-2 text-emerald-400 font-montserrat text-seu-caption animate-in fade-in slide-in-from-left-2 duration-300">
              <CheckCircle2 className="size-5" />
              {t('thankYou')}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
