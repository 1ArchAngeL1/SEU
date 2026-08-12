/** Status chip colours, shared by the floor-plan labels and the detail panel. */
export const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  reserved: { bg: 'bg-blue', text: 'text-white' },
  sold: { bg: 'bg-red', text: 'text-white' },
  available: { bg: 'bg-primary-green', text: 'text-white' },
  not_for_sale: { bg: 'bg-secondary-grey', text: 'text-white' },
};

export function statusColors(status: string): { bg: string; text: string } {
  return STATUS_COLORS[status] ?? STATUS_COLORS.available;
}
