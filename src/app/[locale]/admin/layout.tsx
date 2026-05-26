import { AuthProvider } from '@/components/providers/AuthProvider';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
