'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  FolderKanban,
  Home,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/buildings', label: 'Buildings', icon: Building2 },
  { href: '/admin/apartments', label: 'Apartments', icon: Home },
  { href: '/admin/contacts', label: 'Contacts', icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  // Strip locale prefix (e.g. /en/admin/projects → /admin/projects)
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');

  return (
    <aside className="w-60 shrink-0 border-r border-secondary-black bg-secondary-black/20 flex flex-col">
      <div className="px-5 py-6 border-b border-secondary-black">
        <Link
          href="/admin/projects"
          className="font-[--font-bodoni] font-normal text-seu-subheading text-pale-gray"
        >
          SEU Admin
        </Link>
      </div>

      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathWithoutLocale === href ||
            pathWithoutLocale.startsWith(href + '/');

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg font-montserrat font-medium text-seu-caption transition-colors',
                isActive
                  ? 'bg-secondary-black/60 text-pale-gray'
                  : 'text-secondary-grey hover:text-pale-gray/70 hover:bg-secondary-black/30'
              )}
            >
              <Icon className="size-[1.125rem]" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
