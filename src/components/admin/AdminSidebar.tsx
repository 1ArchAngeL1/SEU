'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  FolderKanban,
  Handshake,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Newspaper,
  PenTool,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';

const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/buildings', label: 'Buildings', icon: Building2 },
  { href: '/admin/apartments', label: 'Units', icon: Home },
  { href: '/admin/partners', label: 'Partners', icon: Handshake },
  { href: '/admin/news', label: 'News', icon: Newspaper },
  { href: '/admin/contacts', label: 'Contacts', icon: MessageSquare },
  { href: '/admin/polygon-editor', label: 'Polygon Editor', icon: PenTool },
  { href: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
  const { logout } = useAuth();

  return (
    <aside className="w-64 shrink-0 relative z-10 bg-admin-card-gradient border-r border-admin-border flex flex-col shadow-admin-lg">
      <div className="px-6 py-7 border-b border-admin-border-soft">
        <Link href="/admin" className="flex items-center gap-3 group">
          <span className="size-10 rounded-xl bg-gradient-to-br from-primary-green to-primary-green/70 grid place-items-center shadow-admin-accent ring-1 ring-primary-green/40">
            <span className="font-[--font-bodoni] text-white text-xl leading-none">
              S
            </span>
          </span>
          <div>
            <div className="font-[--font-bodoni] font-normal text-seu-subheading text-admin-fg leading-none">
              SEU Admin
            </div>
            <div className="text-[0.7rem] text-admin-fg-muted mt-1 font-montserrat tracking-wide uppercase">
              Real estate console
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact
            ? pathWithoutLocale === href
            : pathWithoutLocale === href ||
              pathWithoutLocale.startsWith(href + '/');

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg font-montserrat font-medium text-seu-caption transition-all relative',
                isActive
                  ? 'bg-admin-elevated-gradient text-admin-fg shadow-admin ring-1 ring-primary-green/20'
                  : 'text-admin-fg-muted hover:text-admin-fg hover:bg-admin-hover'
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-gradient-to-b from-primary-green to-primary-green/60 shadow-[0_0_8px] shadow-primary-green/40" />
              )}
              <Icon
                className={cn(
                  'size-[1.125rem] shrink-0',
                  isActive ? 'text-primary-green' : ''
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-admin-border-soft mt-3 flex flex-col gap-1">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-seu-caption-sm text-admin-fg-muted hover:text-admin-fg transition-colors font-montserrat"
        >
          ← Back to site
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 text-seu-caption-sm text-admin-fg-muted hover:text-red transition-colors font-montserrat w-full text-left"
        >
          <LogOut className="size-3.5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
