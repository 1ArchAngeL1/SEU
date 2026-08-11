import Image from 'next/image';
import { Handshake, Mail, Phone, MapPin, ExternalLink, type LucideIcon } from 'lucide-react';
import { fileUrl } from '@/lib/file-url';
import { formatPhone, phoneHref } from '@/lib/phone';

interface PartnerCardProps {
  name: string;
  logoId?: string;
  description?: string;
  mail?: string;
  phone?: string;
  address?: string;
  facebookLink?: string;
  discountPercentage?: number;
}

/**
 * One contact line — icon tile plus its text. Sits on the card's flat
 * background, never on a gradient or an overlay, so it stays readable at every
 * card width.
 */
function ContactLine({
  icon: Icon,
  text,
  href,
  external,
}: {
  icon: LucideIcon;
  text: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <span className="size-6 shrink-0 rounded-md bg-primary-green grid place-items-center shadow-sm shadow-primary-green/30">
        <Icon className="size-3.5 text-white" />
      </span>
      <span className="font-montserrat text-seu-caption-sm text-pale-gray truncate">
        {text}
      </span>
    </>
  );

  if (!href) {
    return (
      <div className="flex items-center gap-2 min-w-0" title={text}>
        {content}
      </div>
    );
  }

  return (
    <a
      href={href}
      title={text}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      className="flex items-center gap-2 min-w-0 rounded-md hover:text-white transition-colors"
    >
      {content}
    </a>
  );
}

export default function PartnerCard({
  name,
  logoId,
  description,
  mail,
  phone,
  address,
  facebookLink,
  discountPercentage,
}: PartnerCardProps) {
  const hasContact = mail || phone || address || facebookLink;

  return (
    // `@container` so the card can size itself to the grid it lands in — two
    // wide columns on the card page, four narrow ones on the about page.
    <div className="@container group relative w-full h-52 lg:h-60 rounded-2xl overflow-hidden bg-dark-green hover-lift border border-white/10 shadow-site">
      {/* Side by side once there is room for both columns; stacked below that,
          so the text column is never squeezed down to a few pixels. */}
      <div className="flex h-full flex-col @sm:flex-row">
        {/* Logo area */}
        <div className="relative shrink-0 flex items-center justify-center bg-white/[0.04] border-b @sm:border-b-0 @sm:border-r border-white/10 h-16 w-full @sm:h-auto @sm:w-36 @lg:w-44 @xl:w-56 p-2 @sm:p-3 @lg:p-5">
          {logoId ? (
            <Image
              src={fileUrl(logoId)}
              alt={name}
              width={200}
              height={120}
              className="object-contain max-h-11 @sm:max-h-24 w-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            />
          ) : (
            <div className="flex flex-col items-center gap-3">
              <span className="size-9 @sm:size-14 rounded-2xl bg-white/5 border border-white/10 grid place-items-center">
                <Handshake className="size-5 @sm:size-7 text-pale-gray/60" />
              </span>
              {/* Stands in for the logo, so it has to read as clearly as one.
                  Dropped when stacked — the heading below already says it. */}
              <span className="line-clamp-2 @max-sm:hidden font-[--font-bodoni] font-normal text-seu-caption text-pale-gray text-center leading-tight">
                {name}
              </span>
            </div>
          )}

          {/* Discount badge */}
          {discountPercentage != null && discountPercentage > 0 && (
            <span className="absolute top-3 left-3 bg-primary-green text-white font-montserrat font-bold text-seu-caption-sm px-2 py-0.5 rounded-md shadow-md shadow-primary-green/30">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Right — Content */}
        <div className="flex-1 min-w-0 p-3 lg:p-4 flex flex-col">
          <h3 className="font-[--font-bodoni] font-normal text-seu-body lg:text-seu-subheading text-pale-gray leading-tight mb-2 truncate">
            {name}
          </h3>

          {description && (
            <p className="line-clamp-2 @lg:line-clamp-3 @max-sm:hidden font-montserrat font-normal text-seu-caption-sm lg:text-seu-caption leading-5 text-secondary-grey flex-1 min-h-0">
              {description}
            </p>
          )}

          {/* Contact + location — always on show. It used to slide in over the
              logo on hover, which left it unreachable on touch screens. */}
          {hasContact && (
            <div className="mt-auto shrink-0 pt-2.5 border-t border-white/10 flex flex-col gap-1.5">
              {address && <ContactLine icon={MapPin} text={address} />}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 min-w-0">
                {phone && (
                  <ContactLine
                    icon={Phone}
                    text={formatPhone(phone)}
                    href={phoneHref(phone)}
                  />
                )}
                {mail && (
                  <ContactLine icon={Mail} text={mail} href={`mailto:${mail}`} />
                )}
                {facebookLink && (
                  <ContactLine
                    icon={ExternalLink}
                    text="Facebook"
                    href={facebookLink}
                    external
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
