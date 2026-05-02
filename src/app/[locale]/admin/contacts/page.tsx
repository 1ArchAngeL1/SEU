'use client';

import { Inbox } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

export default function ContactsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Contact Requests"
        description="Incoming requests from public contact forms"
      />

      <div className="rounded-2xl border border-dashed border-admin-border-soft bg-admin-card p-12 text-center">
        <div className="mx-auto size-14 rounded-2xl bg-primary-green/10 border border-primary-green/30 grid place-items-center mb-4">
          <Inbox className="size-6 text-primary-green" />
        </div>
        <h2 className="font-[--font-bodoni] text-seu-heading text-admin-fg mb-2">
          No backend yet
        </h2>
        <p className="font-montserrat text-seu-caption text-admin-fg-muted max-w-md mx-auto">
          The contacts endpoint is not yet exposed by{' '}
          <span className="text-admin-fg">seu-backend</span>. Once
          <code className="px-1.5 py-0.5 mx-1 rounded bg-admin-input text-admin-fg text-seu-caption-sm">
            POST /api/contacts
          </code>
          ships, this page will list submissions in real time.
        </p>
      </div>
    </div>
  );
}
