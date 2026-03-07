'use client';

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

export function PaginationControl({ currentPage, totalPages, onPageChange }: PaginationControlProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="bg-dark-green flex items-center justify-center gap-3 py-10">
      {pages.map((page, i) =>
        page === '...' ? (
          <span
            key={`ellipsis-${i}`}
            className="w-12 h-12 flex items-center justify-center text-secondary-grey text-seu-body-sm select-none"
          />
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-12 h-12 rounded-xl text-seu-body-sm font-montserrat font-medium transition-colors border ${
              page === currentPage
                ? 'bg-pale-gray text-dark-green border-pale-gray'
                : 'bg-transparent text-pale-gray border-secondary-grey hover:border-pale-gray'
            }`}
          >
            {page}
          </button>
        )
      )}
    </div>
  );
}
