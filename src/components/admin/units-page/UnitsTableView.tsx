'use client';

import { Trash2, ExternalLink, Pencil } from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/admin/StatusBadge';
import type { Unit } from '@/model/types/api';
import { btnPage, currencySymbol } from './styles';

export default function UnitsTableView({
  loading,
  units,
  page,
  totalPages,
  setPage,
  openEdit,
  handleRemove,
}: {
  loading: boolean;
  units: Unit[];
  page: number;
  totalPages: number;
  setPage: (p: number) => void;
  openEdit: (u: Unit) => void;
  handleRemove: (id: string) => void;
}) {
  return (
    <>
      <div className="overflow-hidden rounded-xl border border-admin-border-soft bg-admin-card">
        <table className="w-full text-seu-caption font-montserrat">
          <thead>
            <tr className="bg-admin-input text-left text-admin-fg-muted">
              <th className="p-3 font-medium">Floor</th>
              <th className="p-3 font-medium">Unit #</th>
              <th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium text-right">m²</th>
              <th className="p-3 font-medium text-right">Beds</th>
              <th className="p-3 font-medium text-right">Price</th>
              <th className="p-3 font-medium text-right">/m²</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && units.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="p-8 text-center text-admin-fg-dim"
                >
                  Loading…
                </td>
              </tr>
            ) : units.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="p-10 text-center text-admin-fg-dim"
                >
                  No units found
                </td>
              </tr>
            ) : (
              units.map((u) => {
                const buildingId =
                  typeof u.building === 'string' ? u.building : u.building.id;
                return (
                  <tr
                    key={u.id}
                    className="border-t border-admin-border-soft hover:bg-admin-hover transition-colors"
                  >
                    <td className="p-3 text-admin-fg-muted tabular-nums">
                      {u.floorNumber}
                    </td>
                    <td className="p-3 text-admin-fg font-medium">
                      #{u.unitNumber}
                    </td>
                    <td className="p-3 text-admin-fg-muted capitalize">
                      {u.type}
                    </td>
                    <td className="p-3 text-admin-fg-muted text-right tabular-nums">
                      {u.totalSize}
                    </td>
                    <td className="p-3 text-admin-fg-muted text-right tabular-nums">
                      {u.bedrooms ?? 0}
                    </td>
                    <td className="p-3 text-admin-fg text-right tabular-nums">
                      {currencySymbol(u.price.currency)}
                      {u.price.amount.toLocaleString()}
                    </td>
                    <td className="p-3 text-admin-fg-muted text-right tabular-nums">
                      {u.totalSize > 0
                        ? `${currencySymbol(u.price.currency)}${Math.round(
                            u.price.amount / u.totalSize
                          ).toLocaleString()}`
                        : '—'}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(u)}
                          className="text-admin-fg-muted hover:text-admin-fg transition-colors p-1"
                          title="Edit"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <Link
                          href={`/admin/buildings/${buildingId}`}
                          className="text-primary-orange/80 hover:text-primary-orange transition-colors p-1"
                          title="Open building"
                        >
                          <ExternalLink className="size-4" />
                        </Link>
                        <button
                          onClick={() => handleRemove(u.id)}
                          className="text-rose-400/70 hover:text-rose-300 transition-colors p-1"
                          title="Delete"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex gap-3 mt-6 items-center justify-center">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className={btnPage}
          >
            Prev
          </button>
          <span className="text-seu-caption-sm text-admin-fg-muted">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className={btnPage}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
