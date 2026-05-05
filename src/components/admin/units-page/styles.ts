import type { UnitStatus, UnitType } from '@/model/types/api';

export const btnPrimary =
  'bg-gradient-to-b from-primary-orange to-primary-orange/85 text-white font-montserrat font-medium text-seu-caption px-4 py-2 rounded-lg shadow-md shadow-primary-orange/25 hover:shadow-lg hover:shadow-primary-orange/30 transition-all flex items-center gap-2 disabled:opacity-50';
export const btnSecondary =
  'bg-admin-input-gradient border border-admin-border text-admin-fg font-montserrat font-medium text-seu-caption px-3 py-2 rounded-lg hover:border-admin-border-strong transition-all flex items-center gap-2';
export const btnPage =
  'px-3 py-1.5 border border-admin-border-soft bg-admin-input-gradient rounded-lg text-seu-caption-sm text-admin-fg disabled:opacity-30 hover:bg-admin-hover transition-colors';

export const STATUSES: UnitStatus[] = [
  'available',
  'reserved',
  'sold',
  'not_for_sale',
];
export const TYPES: UnitType[] = ['living', 'commerce', 'parking', 'storage'];

export type ViewMode = 'table' | 'grid' | 'storey';

export function currencySymbol(c: string) {
  if (c === 'USD') return '$';
  if (c === 'EUR') return '€';
  if (c === 'GEL') return '₾';
  return '';
}
