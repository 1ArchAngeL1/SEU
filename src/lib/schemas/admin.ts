import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  address: z.string().min(1, 'Address is required').max(500),
});

export const buildingSchema = z.object({
  projectId: z.string().min(1, 'Project is required'),
  block: z.string().min(1, 'Block name is required').max(10),
  floorCount: z.coerce.number().int().min(1, 'At least 1 floor').max(100),
});

export const apartmentSchema = z.object({
  buildingId: z.string().min(1, 'Building is required'),
  floor: z.coerce.number().int().min(1, 'Floor must be at least 1'),
  apartmentNo: z.coerce.number().int().min(1, 'Apartment number is required'),
  position: z.coerce.number().int().min(1, 'Position is required'),
  totalSize: z.coerce.number().positive('Total size must be positive'),
  mainSize: z.coerce.number().positive('Main size must be positive'),
  openSpaceSize: z.coerce.number().min(0, 'Cannot be negative'),
  bedroomCount: z.coerce.number().int().min(0, 'Cannot be negative'),
  price: z.coerce.number().positive('Price must be positive'),
  status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD']).default('AVAILABLE'),
  rooms: z.array(
    z.object({
      roomType: z.enum([
        'BEDROOM',
        'LIVING_ROOM',
        'KITCHEN',
        'BATHROOM',
        'BALCONY',
        'HALLWAY',
        'STORAGE',
      ]),
      size: z.coerce.number().min(0),
    })
  ),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
export type BuildingFormData = z.infer<typeof buildingSchema>;
export type ApartmentFormData = z.infer<typeof apartmentSchema>;
