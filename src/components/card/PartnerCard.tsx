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
    <div className="group relative w-full h-52 lg:h-60 rounded-2xl overflow-hidden bg-dark-green hover-lift border border-white/10 shadow-site">
      <div className="flex h-full">
        {/* Left — Logo area */}
        <div className="relative w-44 lg:w-56 shrink-0 flex items-center justify-center bg-linear-to-br from-white/5 to-white/[0.02] border-r border-white/10 p-3 lg:p-5">
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
              <span className="size-14 rounded-2xl bg-white/5 border border-white/10 grid place-items-center">
                <Handshake className="size-7 text-pale-gray/50" />
              </span>
              <span className="font-[--font-bodoni] font-normal text-seu-caption text-pale-gray/50 text-center leading-tight">
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

          {/* Hover overlay — slides from left over the logo */}
          {hasContact && (
            <div className="absolute inset-0 bg-dark-green flex flex-col items-stretch justify-center gap-2.5 px-4 py-5 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out">
              {mail && (
                <a
                  href={`mailto:${mail}`}
                  title={mail}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span className="size-9 shrink-0 rounded-lg bg-primary-green grid place-items-center shadow-sm shadow-primary-green/30">
                    <Mail className="size-4 text-white" />
                  </span>
                  <span className="font-montserrat text-seu-caption text-pale-gray truncate">
                    {mail}
                  </span>
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  title={phone}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span className="size-9 shrink-0 rounded-lg bg-primary-green grid place-items-center shadow-sm shadow-primary-green/30">
                    <Phone className="size-4 text-white" />
                  </span>
                  <span className="font-montserrat text-seu-caption text-pale-gray">
                    {phone}
                  </span>
                </a>
              )}
              {address && (
                <div className="flex items-center gap-3 px-2 py-2">
                  <span className="size-9 shrink-0 rounded-lg bg-primary-green grid place-items-center shadow-sm shadow-primary-green/30">
                    <MapPin className="size-4 text-white" />
                  </span>
                  <span className="font-montserrat text-seu-caption text-pale-gray truncate">
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
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span className="size-9 shrink-0 rounded-lg bg-primary-green grid place-items-center shadow-sm shadow-primary-green/30">
                    <ExternalLink className="size-4 text-white" />
                  </span>
                  <span className="font-montserrat text-seu-caption text-pale-gray">
                    Facebook
                  </span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right — Content */}
        <div className="flex-1 min-w-0 p-3 lg:p-4 flex flex-col">
          <h3 className="font-[--font-bodoni] font-normal text-seu-body lg:text-seu-subheading text-pale-gray leading-tight mb-2">
            {name}
          </h3>

          {description && (
            <p className="font-montserrat font-normal text-seu-caption-sm lg:text-seu-caption leading-5 text-secondary-grey line-clamp-4 flex-1">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
