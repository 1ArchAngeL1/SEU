'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  User,
  Phone,
  Mail,
  Send,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useCreateContact } from '@/hooks/queries/use-contacts';

export type ContactFormProps = {
  className?: string;
  variant?: 'default' | 'mobile-diagonal';
  /** Use on pale-gray backgrounds so headings are dark */
  lightBg?: boolean;
  /** Hide the built-in heading (when rendered inside a dialog that has its own title) */
  hideHeader?: boolean;
  /** Extra classes for the privacy-policy note, e.g. `max-w-sm` to keep it off a diagonal background edge */
  policyClassName?: string;
  /**
   * Apartment the form is rendered under, when there is one. Sent with the
   * request so the admin panel shows which unit the visitor asked about.
   */
  unitId?: string;
  /** Fired after a successful submission, after the success message renders */
  onSubmitted?: () => void;
};

/**
 * Digits only, keeping a leading `+` so international numbers still work —
 * `formatPhone()` reads both that and the bare local form. Everything else the
 * user types or pastes (letters, spaces, brackets, dashes) is dropped.
 */
function sanitizePhone(value: string): string {
  return (value.startsWith('+') ? '+' : '') + value.replace(/\D/g, '');
}

export default function ContactForm({
  className,
  variant = 'default',
  lightBg = false,
  hideHeader = false,
  policyClassName,
  unitId,
  onSubmitted,
}: ContactFormProps) {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const createContact = useCreateContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone.trim()) return;
    setError('');

    try {
      await createContact.mutateAsync({
        phone: formData.phone.trim(),
        ...(formData.name.trim() ? { name: formData.name.trim() } : {}),
        ...(formData.email.trim() ? { email: formData.email.trim() } : {}),
        ...(unitId ? { unit: unitId } : {}),
      });
      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '' });
      setTimeout(() => setSubmitted(false), 4000);
      if (onSubmitted) setTimeout(onSubmitted, 1500);
    } catch {
      setError(t('errorMessage'));
    }
  };

  const inputBase =
    'w-full bg-site-bg-input border border-site-input-border rounded-xl pl-12 pr-6 py-4 font-montserrat font-medium text-seu-body-sm text-site-input-text placeholder-site-fg-dim focus:outline-none focus:border-primary-green/60 site-input-glow transition-all';

  type Field = {
    icon: LucideIcon;
    type: 'text' | 'tel' | 'email';
    placeholder: string;
    key: keyof typeof formData;
    required?: boolean;
    /** Rewrites what the user typed before it reaches state. */
    sanitize?: (value: string) => string;
  };

  const fields: Field[] = [
    {
      icon: User,
      type: 'text',
      placeholder: t('namePlaceholder'),
      key: 'name',
    },
    {
      icon: Phone,
      type: 'tel',
      placeholder: t('phonePlaceholder'),
      key: 'phone',
      required: true,
      sanitize: sanitizePhone,
    },
    {
      icon: Mail,
      type: 'email',
      placeholder: t('emailPlaceholder'),
      key: 'email',
    },
  ];

  return (
    <div className={cn('w-full', className)}>
      {/* Heading */}
      {!hideHeader && (
        <div className="mb-10 text-left">
          <h2
            className={cn(
              'text-left font-[--font-bodoni] font-normal text-seu-title lg:text-seu-title-lg leading-none animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.4s_both]',
              lightBg ? 'text-dark-green' : 'text-site-fg-strong'
            )}
          >
            {t('requestsCall')}
          </h2>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 w-full"
      >
        {fields.map((field, i) => {
          const Icon = field.icon;
          return (
            <div
              key={field.key}
              className="relative group animate-[fadeInUp_0.6s_cubic-bezier(0.16,1,0.3,1)_both]"
              style={{ animationDelay: `${500 + i * 100}ms` }}
            >
              <span className="absolute left-4 top-1/2 -translate-y-1/2 size-5 grid place-items-center pointer-events-none">
                <Icon className="size-5 text-site-fg-muted group-focus-within:text-primary-green transition-colors" />
              </span>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.key]}
                onChange={(e) => {
                  const value = field.sanitize
                    ? field.sanitize(e.target.value)
                    : e.target.value;
                  setFormData({ ...formData, [field.key]: value });
                }}
                required={field.required}
                className={inputBase}
              />
            </div>
          );
        })}

        <div className="mt-2 flex flex-col gap-3 animate-[fadeInUp_0.6s_cubic-bezier(0.16,1,0.3,1)_0.8s_both]">
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={createContact.isPending}
              className="flex items-center gap-3 bg-primary-green text-white font-montserrat font-medium text-seu-body px-10 py-3.5 rounded-xl shadow-lg shadow-primary-green/25 hover:shadow-xl hover:shadow-primary-green/30 hover:bg-primary-green/90 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {createContact.isPending ? t('sending') : t('submit')}
              <Send className="size-4" />
            </button>

            {submitted && (
              <span className="flex items-center gap-2 text-emerald-400 font-montserrat text-seu-caption animate-in fade-in slide-in-from-left-2 duration-300">
                <CheckCircle2 className="size-5" />
                {t('thankYou')}
              </span>
            )}
          </div>

          {error && (
            <span className="flex items-center gap-2 text-red font-montserrat text-seu-caption">
              <AlertCircle className="size-4" />
              {error}
            </span>
          )}
        </div>

        <p
          className={cn(
            'mt-4 font-montserrat text-seu-caption-sm leading-relaxed',
            lightBg ? 'text-dark-green/55' : 'text-site-fg-dim',
            policyClassName
          )}
        >
          {t('agreePolicy')}
        </p>
      </form>
    </div>
  );
}
