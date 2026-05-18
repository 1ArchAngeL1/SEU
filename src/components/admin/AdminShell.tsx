'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { usePathname } from '@/i18n/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage || !isLoggedIn) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen relative flex text-admin-fg bg-admin-bg">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-50 bg-admin-bg-pattern"
      />
      <AdminSidebar />
      <main className="flex-1 overflow-y-scroll relative z-10">
        <div className="max-w-[1400px] mx-auto px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
