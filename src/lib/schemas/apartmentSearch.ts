import { z } from 'zod';

// Coerces an empty string to undefined, otherwise parses as a positive number
const optionalPositiveNumber = z
  .string()
  .transform((val) => (val.trim() === '' ? undefined : Number(val)))
  .pipe(z.number().positive('Must be positive').optional());

export const apartmentSearchSchema = z
  .object({
    project: z.string(),
    block: z.string(),
    sizeFrom: optionalPositiveNumber,
    sizeTo: optionalPositiveNumber,
    rooms: z.number().int().min(1).max(5).nullable(),
    currency: z.enum(['USD', 'GEL']),
    priceFrom: optionalPositiveNumber,
    priceTo: optionalPositiveNumber,
  })
  .refine(
    ({ sizeFrom, sizeTo }) =>
      sizeFrom === undefined || sizeTo === undefined || sizeFrom <= sizeTo,
    { message: 'Size "from" must be ≤ "to"', path: ['sizeFrom'] }
  )
  .refine(
    ({ priceFrom, priceTo }) =>
      priceFrom === undefined || priceTo === undefined || priceFrom <= priceTo,
    { message: 'Price "from" must be ≤ "to"', path: ['priceFrom'] }
  );

export type ApartmentSearchFilters = z.infer<typeof apartmentSearchSchema>;
