'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type PaginationControlProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 1) return [1];

  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);

  if (current >= total - 2) {
    pages.add(Math.max(1, total - 2));
    pages.add(Math.max(1, total - 1));
  } else {
    pages.add(current);
    pages.add(current + 1);
    pages.add(current + 2);
  }

  const sorted = [...pages].sort((a, b) => a - b);

  const result: (number | '...')[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('...');
    }
    result.push(sorted[i]);
  }

  return result;
}

const baseBtnClass =
  'rounded-xl font-montserrat font-medium text-seu-body-sm transition-all border';
const inactiveBtnClass =
  'bg-transparent text-site-fg border-site-border-strong hover:bg-site-bg-hover hover:border-site-fg hover:text-site-fg-strong';
const activeBtnClass =
  'bg-site-fg text-site-bg border-site-fg hover:bg-site-fg hover:text-site-bg shadow-sm';
const navBtnClass =
  'bg-transparent text-site-fg border-site-border-strong hover:bg-site-bg-hover hover:border-site-fg hover:text-site-fg-strong disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-site-border-strong disabled:hover:text-site-fg';

export function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="bg-site-bg flex items-center justify-center gap-1.5 lg:gap-2 py-8 lg:py-10 px-4">
      <Button
        type="button"
        size="icon-lg"
        variant="outline"
        disabled={!canPrev}
        onClick={() => canPrev && onPageChange(currentPage - 1)}
        aria-label="Previous page"
        className={cn(baseBtnClass, navBtnClass, 'size-11')}
      >
        <ChevronLeft className="size-4" />
      </Button>

      {pages.map((page, i) =>
        page === '...' ? (
          <span
            key={`ellipsis-${i}`}
            className="size-11 flex items-center justify-center text-site-fg-muted font-montserrat text-seu-body-sm select-none"
          >
            …
          </span>
        ) : (
          <Button
            key={page}
            type="button"
            size="icon-lg"
            variant={page === currentPage ? 'default' : 'outline'}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={cn(
              baseBtnClass,
              page === currentPage ? activeBtnClass : inactiveBtnClass,
              'size-11'
            )}
          >
            {page}
          </Button>
        )
      )}

      <Button
        type="button"
        size="icon-lg"
        variant="outline"
        disabled={!canNext}
        onClick={() => canNext && onPageChange(currentPage + 1)}
        aria-label="Next page"
        className={cn(baseBtnClass, navBtnClass, 'size-11')}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
