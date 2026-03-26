'use client';

import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { getContactRequests, removeContactRequest } from '@/prisma/contact';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

const btnPage =
  'px-3 py-1.5 border border-secondary-black rounded-lg text-seu-caption-sm text-pale-gray disabled:opacity-30 hover:bg-secondary-black/40 transition-colors';

type ContactItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
};

export default function ContactsPage() {
  const [page, setPage] = useState(1);
  const [rev, setRev] = useState(0);
  const [data, setData] = useState<{
    items: ContactItem[];
    totalPages: number;
  }>({ items: [], totalPages: 1 });

  useEffect(() => {
    getContactRequests({ page, pageSize: 10 }).then((res) => {
      setData({ items: res.items as ContactItem[], totalPages: res.totalPages });
    });
  }, [page, rev]);

  async function handleRemove(id: string) {
    if (!confirm('Delete this contact request?')) return;
    await removeContactRequest(id);
    setRev((r) => r + 1);
  }

  return (
    <div>
      <AdminPageHeader
        title="Contact Requests"
        description="Incoming contact form submissions"
      />

      <div className="overflow-x-auto rounded-lg border border-secondary-black">
        <table className="w-full text-seu-caption font-montserrat">
          <thead>
            <tr className="bg-secondary-black/40 text-left text-secondary-grey">
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Phone</th>
              <th className="p-3 font-medium">Received</th>
              <th className="p-3 font-medium w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.items.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-secondary-grey/60"
                >
                  No contact requests
                </td>
              </tr>
            ) : (
              data.items.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-secondary-black hover:bg-secondary-black/20 transition-colors"
                >
                  <td className="p-3 text-pale-gray">{c.name}</td>
                  <td className="p-3 text-pale-gray/70">{c.email}</td>
                  <td className="p-3 text-pale-gray/70">{c.phone}</td>
                  <td className="p-3 text-pale-gray/50">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleRemove(c.id)}
                      className="text-red/60 hover:text-red transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data.totalPages > 1 && (
        <div className="flex gap-3 mt-6 items-center justify-center">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className={btnPage}
          >
            Prev
          </button>
          <span className="text-seu-caption-sm text-secondary-grey">
            {page} / {data.totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(data.totalPages, page + 1))}
            disabled={page === data.totalPages}
            className={btnPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
