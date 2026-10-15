'use client';

import { useEffect, useRef, useState } from 'react';
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
import { usePublicUnit } from '@/hooks/queries/use-units';
import {
  type LeadSource,
  trackGenerateLead,
  trackLeadError,
  trackLeadFormStart,
} from '@/lib/analytics/events';

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
  /**
   * Where on the site this form sits. Travels with every analytics event the
   * form fires, so a lead off an apartment page is told apart from a "call me"
   * on the landing page. Required on purpose — an unlabelled lead is a hole in
   * the conversion report.
   */
  source: LeadSource;
  /** Fired after a successful submission, after the success message renders */
  onSubmitted?: () => void;
};

/**
 * How long the confirmation stays on screen. Deliberately generous: the visitor
 * has just handed over their phone number and needs time to read that a sales
 * manager will call — a flash of green tells them nothing.
 */
const SUCCESS_VISIBLE_MS = 12_000;

/**
 * How long a host that closes itself on success (the request-a-call dialog)
 * waits first, so the confirmation is readable before the dialog disappears.
 * Long enough to read both lines without hurrying, and still short of the
 * inline notice above — the dialog is in the way of the page behind it.
 */
const ON_SUBMITTED_DELAY_MS = 9_000;

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
  source,
  onSubmitted,
}: ContactFormProps) {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const createContact = useCreateContact();
  // The apartment this form sits under, when there is one, so a lead reports
  // the project, block, floor and layout it came from rather than a bare id.
  // Read from the cache rather than taken as a prop: the apartment page has
  // already fetched it under exactly this key, so there is no second request
  // and no caller has to thread the whole unit down. Disabled without a
  // `unitId`, which is every form outside an apartment page.
  const unitQ = usePublicUnit(unitId);
  // One `lead_form_start` per mounted form: the ratio of starts to leads is
  // the form's abandonment rate, and a per-keystroke event would flatten it.
  const startTracked = useRef(false);

  // The dialog unmounts this form when it closes, so pending timers have to go
  // with it — otherwise they fire into a component that is no longer there.
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

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
      trackGenerateLead({
        source,
        unit: unitQ.data,
        unitId,
        hasName: Boolean(formData.name.trim()),
        hasEmail: Boolean(formData.email.trim()),
      });
      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '' });
      later(() => setSubmitted(false), SUCCESS_VISIBLE_MS);
      if (onSubmitted) later(onSubmitted, ON_SUBMITTED_DELAY_MS);
    } catch {
      // A rejected request is a lost lead, and invisible in the reports
      // otherwise — the visitor simply never appears as a conversion.
      trackLeadError(source, unitId);
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
                  if (!startTracked.current) {
                    startTracked.current = true;
                    trackLeadFormStart(source, unitId);
                  }
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
          </div>

          {submitted && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <CheckCircle2
                className={cn(
                  'size-5 shrink-0 mt-0.5',
                  lightBg ? 'text-emerald-600' : 'text-emerald-400'
                )}
              />
              <div className="flex flex-col gap-1">
                <span
                  className={cn(
                    'font-montserrat font-semibold text-seu-body-sm',
                    lightBg ? 'text-emerald-700' : 'text-emerald-400'
                  )}
                >
                  {t('successTitle')}
                </span>
                <span
                  className={cn(
                    'font-montserrat text-seu-caption leading-relaxed',
                    lightBg ? 'text-dark-green/75' : 'text-site-fg-muted'
                  )}
                >
                  {t('successMessage')}
                </span>
              </div>
            </div>
          )}

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
