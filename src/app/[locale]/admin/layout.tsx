import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminThemeProvider } from '@/components/admin/AdminThemeProvider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminThemeProvider>
      <div className="min-h-screen relative flex text-admin-fg bg-admin-bg">
        {/* Ambient background pattern — flips with theme via CSS var */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 opacity-50 bg-admin-bg-pattern"
        />
        <AdminSidebar />
        <main className="flex-1 overflow-auto relative z-10">
          <div className="max-w-[1400px] mx-auto px-8 py-10">{children}</div>
        </main>
      </div>
    </AdminThemeProvider>
  );
}
