'use client';

import { useEffect, useRef, useState } from 'react';
import {
  GripVertical,
  ArrowUp,
  ArrowDown,
  Handshake,
  Loader2,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { fileUrl } from '@/lib/file-url';

const btnPrimary =
  'bg-gradient-to-b from-primary-green to-primary-green/85 text-white font-montserrat font-medium text-seu-caption px-4 py-2 rounded-lg shadow-md shadow-primary-green/25 hover:shadow-lg hover:shadow-primary-green/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

const arrowBtn =
  'size-7 grid place-items-center rounded-md border border-admin-border-soft text-admin-fg-muted hover:bg-admin-hover hover:text-admin-fg disabled:opacity-25 disabled:pointer-events-none transition-colors';

/** Minimal shape any reorderable admin entity satisfies. */
export type ReorderableItem = {
  id: string;
  nameEn: string;
  nameKa: string;
  logoId?: string;
};

type ReorderSheetProps<T extends ReorderableItem> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Items in their current (server) order. */
  items: T[];
  /** Persist the new order (array of ids, first = shown first). */
  onSave: (orderedIds: string[]) => Promise<unknown>;
  saving?: boolean;
  title?: string;
  description?: string;
};

function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) return list;
  const next = list.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export default function ReorderSheet<T extends ReorderableItem>({
  open,
  onOpenChange,
  items,
  onSave,
  saving = false,
  title = 'Reorder',
  description = 'Drag the rows — or use the arrows — then save. This is the order visitors see.',
}: ReorderSheetProps<T>) {
  const [order, setOrder] = useState<T[]>(items);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const wasOpen = useRef(false);

  // Seed the working copy from the server list only when the sheet opens, so a
  // background refetch can't clobber an in-progress reorder.
  useEffect(() => {
    if (open && !wasOpen.current) {
      setOrder(items);
      setDragIndex(null);
    }
    wasOpen.current = open;
  }, [open, items]);

  const dirty =
    order.length !== items.length ||
    order.some((it, i) => it.id !== items[i]?.id);

  function handleDrop(targetIndex: number) {
    setOrder((prev) =>
      dragIndex === null ? prev : move(prev, dragIndex, targetIndex),
    );
    setDragIndex(null);
  }

  async function handleSave() {
    if (!dirty) {
      onOpenChange(false);
      return;
    }
    await onSave(order.map((i) => i.id));
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0"
      >
        <SheetHeader className="border-b border-admin-border-soft">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {order.length === 0 ? (
            <p className="text-center font-montserrat text-seu-caption text-admin-fg-muted py-12">
              Nothing to reorder yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {order.map((item, index) => {
                const src = fileUrl(item.logoId);
                const dragging = dragIndex === index;
                return (
                  <li
                    key={item.id}
                    draggable
                    onDragStart={() => setDragIndex(index)}
                    onDragEnd={() => setDragIndex(null)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (dragIndex !== null && dragIndex !== index) {
                        setOrder((prev) => move(prev, dragIndex, index));
                        setDragIndex(index);
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDrop(index);
                    }}
                    className={`flex items-center gap-3 rounded-xl border bg-admin-card px-3 py-2 select-none transition-colors ${
                      dragging
                        ? 'border-primary-green/60 opacity-60'
                        : 'border-admin-border-soft'
                    }`}
                  >
                    <GripVertical className="size-4 text-admin-fg-dim shrink-0 cursor-grab active:cursor-grabbing" />

                    <span className="w-5 text-center font-montserrat text-seu-caption-sm text-admin-fg-dim shrink-0">
                      {index + 1}
                    </span>

                    <span className="size-10 rounded-md bg-admin-deep border border-admin-border-soft grid place-items-center overflow-hidden shrink-0">
                      {src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={src}
                          alt={item.nameEn || item.nameKa}
                          className="max-h-8 max-w-[85%] object-contain"
                        />
                      ) : (
                        <Handshake className="size-4 text-admin-fg-dim" />
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-montserrat text-seu-caption text-admin-fg">
                        {item.nameEn || item.nameKa || 'Untitled'}
                      </span>
                      {item.nameKa && item.nameEn && (
                        <span className="block truncate font-montserrat text-seu-caption-sm text-admin-fg-muted">
                          {item.nameKa}
                        </span>
                      )}
                    </span>

                    <span className="flex flex-col gap-1 shrink-0">
                      <button
                        type="button"
                        aria-label="Move up"
                        disabled={index === 0}
                        onClick={() =>
                          setOrder((prev) => move(prev, index, index - 1))
                        }
                        className={arrowBtn}
                      >
                        <ArrowUp className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Move down"
                        disabled={index === order.length - 1}
                        onClick={() =>
                          setOrder((prev) => move(prev, index, index + 1))
                        }
                        className={arrowBtn}
                      >
                        <ArrowDown className="size-3.5" />
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-admin-border-soft p-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className="font-montserrat text-seu-caption text-admin-fg-muted hover:text-admin-fg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !dirty}
            className={btnPrimary}
          >
            {saving && <Loader2 className="size-4 animate-spin" />}
            {saving ? 'Saving…' : 'Save order'}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
