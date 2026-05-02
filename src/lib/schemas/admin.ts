import { z } from 'zod';

const localizedString = z.object({
  ka: z.string().trim().optional(),
  en: z.string().trim().optional(),
});

export const projectSchema = z.object({
  nameKa: z.string().min(1, 'Georgian name is required').max(200),
  nameEn: z.string().min(1, 'English name is required').max(200),
  address: z.string().min(1, 'Address is required').max(500),
  city: z.string().max(120).optional().or(z.literal('')),
  district: z.string().max(120).optional().or(z.literal('')),
  status: z.enum([
    'planning',
    'presale',
    'under_construction',
    'completed',
    'sold_out',
    'archived',
  ]),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
});

export const buildingSchema = z.object({
  project: z.string().min(1, 'Project is required'),
  nameKa: z.string().min(1, 'Georgian name is required').max(200),
  nameEn: z.string().min(1, 'English name is required').max(200),
  block: z.string().min(1, 'Block is required').max(20),
  floors: z.coerce.number().int().min(1, 'At least 1 floor').max(200),
  basementFloors: z.coerce.number().int().min(0).max(20).optional(),
  status: z.enum([
    'planning',
    'foundation',
    'under_construction',
    'finishing',
    'completed',
    'occupied',
  ]),
  constructionProgress: z.coerce.number().int().min(0).max(100).optional(),
});

export const unitSchema = z.object({
  unitNumber: z.string().min(1, 'Unit number required').max(50),
  block: z.string().min(1, 'Block required').max(20),
  floor: z.coerce.number().int(),
  type: z.enum(['living', 'commerce', 'parking', 'storage']),
  status: z.enum(['available', 'reserved', 'sold', 'not_for_sale']),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  totalSize: z.coerce.number().positive('Total size must be positive'),
  livableArea: z.coerce.number().min(0).optional(),
  balconySize: z.coerce.number().min(0).optional(),
  amount: z.coerce.number().min(0, 'Price must be 0 or more'),
  currency: z.string().min(1).max(8),
  furnishingStatus: z.enum([
    'without',
    'rough_draft',
    'finishing',
    'shell_and_core',
  ]),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
export type BuildingFormData = z.infer<typeof buildingSchema>;
export type UnitFormData = z.infer<typeof unitSchema>;
export { localizedString };
