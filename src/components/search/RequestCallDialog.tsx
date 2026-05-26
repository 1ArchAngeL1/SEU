'use client';

import { Phone, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Dialog as DialogPrimitive } from 'radix-ui';
import ContactForm from '@/components/ContactForm';
import { cn } from '@/lib/utils';

interface RequestCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RequestCallDialog({
  open,
  onOpenChange,
}: RequestCallDialogProps) {
  const t = useTranslations('contact');

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            'fixed top-[50%] left-[50%] z-50 w-[min(100%-2rem,32rem)] translate-x-[-50%] translate-y-[-50%]',
            'max-h-[92vh] overflow-y-auto rounded-2xl border border-pale-gray/15 bg-site-bg text-site-fg',
            'shadow-[0_24px_80px_rgba(0,0,0,0.6)] outline-none',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'px-6 sm:px-10 pt-7 pb-9'
          )}
        >
          {/* Close button */}
          <DialogPrimitive.Close
            className="absolute top-4 right-4 size-9 rounded-full bg-site-bg-hover/80 border border-site-border-soft grid place-items-center text-site-fg-muted hover:text-site-fg hover:border-site-border transition-colors"
            aria-label="Close"
          >
            <X className="size-4" />
          </DialogPrimitive.Close>

          {/* Header */}
          <div className="mb-7 pr-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="size-9 rounded-full bg-primary-green/15 border border-primary-green/30 grid place-items-center text-primary-green">
                <Phone className="size-4" />
              </span>
              <span className="font-montserrat font-semibold text-seu-caption-sm uppercase tracking-[0.2em] text-primary-green">
                {t('submit')}
              </span>
            </div>
            <DialogPrimitive.Title className="font-[--font-bodoni] font-normal text-seu-heading lg:text-seu-heading-lg text-site-fg-strong leading-none">
              {t('requestsCall')}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="font-montserrat text-seu-caption sm:text-seu-caption text-site-fg-muted mt-3">
              {t('thankYou')}
            </DialogPrimitive.Description>
          </div>

          <ContactForm
            hideHeader
            className="!w-full"
            onSubmitted={() => onOpenChange(false)}
          />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
