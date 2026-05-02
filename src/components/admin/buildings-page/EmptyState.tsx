'use client';

import { Building2 } from 'lucide-react';

export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-admin-border-soft bg-admin-card p-12 text-center">
      <Building2 className="size-10 text-admin-fg-dim mx-auto mb-3" />
      <p className="font-montserrat text-seu-caption text-admin-fg-muted">
        {message}
      </p>
    </div>
  );
}
