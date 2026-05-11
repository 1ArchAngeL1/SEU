import Image from 'next/image';
import { Handshake, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { fileUrl } from '@/lib/file-url';

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
    <div className="group relative w-full h-56 rounded-2xl overflow-hidden bg-site-bg-card hover-lift">
      <div className="flex h-full">
        {/* Left — Logo area */}
        <div className="relative w-44 shrink-0 flex items-center justify-center bg-linear-to-br from-site-bg-hover to-site-bg-hover/30 border-r border-site-border-soft p-5">
          {logoId ? (
            <Image
              src={fileUrl(logoId)}
              alt={name}
              width={200}
              height={120}
              className="object-contain max-h-24 w-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            />
          ) : (
            <div className="flex flex-col items-center gap-3">
              <span className="size-14 rounded-2xl bg-site-bg-hover border border-site-border-soft grid place-items-center">
                <Handshake className="size-7 text-site-fg-dim" />
              </span>
              <span className="font-[--font-bodoni] font-normal text-seu-caption text-site-fg-dim text-center leading-tight">
                {name}
              </span>
            </div>
          )}

          {/* Discount badge */}
          {discountPercentage != null && discountPercentage > 0 && (
            <span className="absolute top-3 left-3 bg-primary-orange text-white font-montserrat font-bold text-seu-caption-sm px-2 py-0.5 rounded-md shadow-md shadow-primary-orange/30">
              -{discountPercentage}%
            </span>
          )}

          {/* Hover overlay — slides from left over the logo */}
          {hasContact && (
            <div className="absolute inset-0 bg-site-bg-card flex flex-col items-stretch justify-center gap-2 px-3 py-4 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out">
              {mail && (
                <a
                  href={`mailto:${mail}`}
                  title={mail}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-site-bg-hover transition-colors"
                >
                  <span className="size-7 shrink-0 rounded-lg bg-primary-orange grid place-items-center shadow-sm shadow-primary-orange/30">
                    <Mail className="size-3.5 text-white" />
                  </span>
                  <span className="font-montserrat text-seu-caption-sm text-site-fg truncate">
                    {mail}
                  </span>
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  title={phone}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-site-bg-hover transition-colors"
                >
                  <span className="size-7 shrink-0 rounded-lg bg-primary-orange grid place-items-center shadow-sm shadow-primary-orange/30">
                    <Phone className="size-3.5 text-white" />
                  </span>
                  <span className="font-montserrat text-seu-caption-sm text-site-fg">
                    {phone}
                  </span>
                </a>
              )}
              {address && (
                <div className="flex items-center gap-2.5 px-2 py-1.5">
                  <span className="size-7 shrink-0 rounded-lg bg-primary-orange grid place-items-center shadow-sm shadow-primary-orange/30">
                    <MapPin className="size-3.5 text-white" />
                  </span>
                  <span className="font-montserrat text-seu-caption-sm text-site-fg truncate">
                    {address}
                  </span>
                </div>
              )}
              {facebookLink && (
                <a
                  href={facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook"
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-site-bg-hover transition-colors"
                >
                  <span className="size-7 shrink-0 rounded-lg bg-primary-orange grid place-items-center shadow-sm shadow-primary-orange/30">
                    <ExternalLink className="size-3.5 text-white" />
                  </span>
                  <span className="font-montserrat text-seu-caption-sm text-site-fg">
                    Facebook
                  </span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right — Content */}
        <div className="flex-1 min-w-0 p-5 flex flex-col">
          <h3 className="font-[--font-bodoni] font-normal text-seu-subheading text-site-fg leading-tight mb-3">
            {name}
          </h3>

          {description && (
            <p className="font-montserrat font-normal text-seu-caption leading-6 text-site-fg-muted line-clamp-5 flex-1">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
