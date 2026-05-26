'use client';

import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Newspaper,
  Tag,
  ImageIcon,
} from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import NewsForm from '@/components/admin/forms/NewsForm';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import {
  useNewsList,
  useCreateNews,
  useUpdateNews,
  useDeleteNews,
} from '@/hooks/queries/use-news';
import { fileUrl } from '@/lib/file-url';
import type { NewsArticle, CreateNewsInput } from '@/model/types/api';

const btnPrimary =
  'bg-gradient-to-b from-primary-green to-primary-green/85 text-white font-montserrat font-medium text-seu-caption px-4 py-2 rounded-lg shadow-md shadow-primary-green/25 hover:shadow-lg hover:shadow-primary-green/30 transition-all flex items-center gap-2';
const btnPage =
  'px-3 py-1.5 border border-admin-border-soft bg-admin-input-gradient rounded-lg text-seu-caption-sm text-admin-fg disabled:opacity-30 hover:bg-admin-hover transition-colors';

export default function AdminNewsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<NewsArticle | null>(null);

  const newsQ = useNewsList({ page, limit: 12 });
  const createMut = useCreateNews();
  const updateMut = useUpdateNews();
  const deleteMut = useDeleteNews();

  const allItems = newsQ.data?.items ?? [];
  const items = search
    ? allItems.filter(
        (n) =>
          n.header.toLowerCase().includes(search.toLowerCase()) ||
          n.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      )
    : allItems;
  const totalPages = newsQ.data?.pagination.totalPages ?? 1;
  const total = newsQ.data?.pagination.total ?? 0;

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(article: NewsArticle) {
    setEditing(article);
    setDialogOpen(true);
  }

  async function handleSubmit(input: CreateNewsInput) {
    if (editing) {
      await updateMut.mutateAsync({ id: editing.id, input });
    } else {
      await createMut.mutateAsync(input);
    }
    setDialogOpen(false);
    setEditing(null);
  }

  async function handleRemove(id: string) {
    if (!confirm('Delete this news article?')) return;
    await deleteMut.mutateAsync(id);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <div>
      <AdminPageHeader
        title="News"
        description="Manage news articles and updates"
        badge={
          <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted">
            {total} total
          </span>
        }
        action={
          <button onClick={openCreate} className={btnPrimary}>
            <Plus className="size-4" />
            New Article
          </button>
        }
      />

      <div className="mb-5">
        <div className="relative">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-admin-fg-dim z-10 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search news…"
            className="pl-9 w-72"
          />
        </div>
      </div>

      {newsQ.isLoading && items.length === 0 ? (
        <div className="rounded-2xl border border-admin-border-soft bg-admin-card p-16 text-center font-montserrat text-seu-caption text-admin-fg-dim">
          Loading news…
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-admin-border-soft bg-admin-card p-12 text-center">
          <Newspaper className="size-10 text-admin-fg-dim mx-auto mb-4" />
          <p className="font-montserrat text-seu-body-sm text-admin-fg-muted mb-1">
            No news articles yet
          </p>
          <p className="font-montserrat text-seu-caption text-admin-fg-muted mb-5">
            Click <em>New Article</em> to add the first one.
          </p>
          <button onClick={openCreate} className={btnPrimary + ' mx-auto'}>
            <Plus className="size-4" />
            New Article
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((article) => (
            <div
              key={article.id}
              className="rounded-2xl border border-admin-border-soft bg-admin-card-gradient overflow-hidden shadow-admin group hover:border-primary-green/30 transition-colors"
            >
              {/* Image area */}
              <div className="h-40 bg-admin-deep flex items-center justify-center border-b border-admin-border-soft overflow-hidden">
                {article.image.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={fileUrl(article.image[0])}
                    alt={article.header}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="size-10 text-admin-fg-dim" />
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <h3 className="font-[--font-bodoni] text-seu-body-lg text-admin-fg leading-tight line-clamp-2">
                  {article.header}
                </h3>

                <p className="font-montserrat text-seu-caption-sm text-admin-fg-muted line-clamp-2">
                  {article.description}
                </p>

                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-0.5 bg-admin-hover border border-admin-border-soft rounded font-montserrat text-seu-caption-sm text-admin-fg-muted"
                      >
                        <Tag className="size-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="font-montserrat text-seu-caption-sm text-admin-fg-dim pt-1">
                  {formatDate(article.createdAt)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex border-t border-admin-border-soft">
                <button
                  onClick={() => openEdit(article)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-admin-fg-muted hover:text-admin-fg hover:bg-admin-hover transition-colors font-montserrat text-seu-caption-sm"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </button>
                <div className="w-px bg-admin-border-soft" />
                <button
                  onClick={() => handleRemove(article.id)}
                  disabled={deleteMut.isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-rose-400/70 hover:text-rose-300 hover:bg-admin-hover transition-colors font-montserrat text-seu-caption-sm"
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Add card */}
          <button
            onClick={openCreate}
            className="rounded-2xl border border-dashed border-admin-border bg-admin-card/40 p-6 text-center hover:border-primary-green/60 hover:bg-primary-green/5 transition-colors flex flex-col items-center justify-center min-h-[16rem] group"
          >
            <span className="size-12 rounded-full border border-admin-border group-hover:border-primary-green/60 grid place-items-center mb-3 transition-colors">
              <Plus className="size-5 text-admin-fg-muted group-hover:text-primary-green transition-colors" />
            </span>
            <span className="font-montserrat text-seu-caption text-admin-fg-muted group-hover:text-admin-fg transition-colors">
              New article
            </span>
          </button>
        </div>
      )}

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

      <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col p-0">
          <SheetHeader>
            <SheetTitle>
              {editing ? 'Edit Article' : 'New Article'}
            </SheetTitle>
            <SheetDescription>
              {editing
                ? 'Update news article details'
                : 'Create a new news article'}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <NewsForm
              initialData={editing ?? undefined}
              onSubmit={handleSubmit}
              onCancel={() => setDialogOpen(false)}
              submitLabel={editing ? 'Update' : 'Create'}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
