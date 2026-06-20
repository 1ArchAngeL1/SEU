import { z } from 'zod';

export const projectSchema = z.object({
  nameKa: z.string().min(1, 'Georgian name is required').max(200),
  nameEn: z.string().min(1, 'English name is required').max(200),
  addressEn: z.string().min(1, 'English address is required').max(500),
  addressKa: z.string().min(1, 'Georgian address is required').max(500),
  cityEn: z.string().max(120).optional().or(z.literal('')),
  cityKa: z.string().max(120).optional().or(z.literal('')),
  districtEn: z.string().max(120).optional().or(z.literal('')),
  districtKa: z.string().max(120).optional().or(z.literal('')),
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
  addressEn: z.string().max(500).optional().or(z.literal('')),
  addressKa: z.string().max(500).optional().or(z.literal('')),
  floors: z.coerce.number().int().min(1, 'At least 1 floor').max(200),
  floorsAboveGround: z.coerce.number().int().min(0).max(200).optional(),
  basementLevels: z.coerce.number().int().min(0).max(20).optional(),
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
  entranceEn: z.string().max(120).optional().or(z.literal('')),
  entranceKa: z.string().max(120).optional().or(z.literal('')),
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

export const newsSchema = z.object({
  headerEn: z.string().min(1, 'English header is required').max(300),
  headerKa: z.string().min(1, 'Georgian header is required').max(300),
  descriptionEn: z.string().min(1, 'English description is required'),
  descriptionKa: z.string().min(1, 'Georgian description is required'),
  tags: z.array(z.string()).optional(),
});

export const partnerSchema = z.object({
  nameEn: z.string().min(1, 'English name is required').max(200),
  nameKa: z.string().min(1, 'Georgian name is required').max(200),
  descriptionEn: z.string().max(2000).optional().or(z.literal('')),
  descriptionKa: z.string().max(2000).optional().or(z.literal('')),
  addressEn: z.string().max(500).optional().or(z.literal('')),
  addressKa: z.string().max(500).optional().or(z.literal('')),
  mail: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(40).optional().or(z.literal('')),
  facebookLink: z.string().url().optional().or(z.literal('')),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
export type BuildingFormData = z.infer<typeof buildingSchema>;
export type UnitFormData = z.infer<typeof unitSchema>;
export type NewsFormData = z.infer<typeof newsSchema>;
export type PartnerFormData = z.infer<typeof partnerSchema>;
