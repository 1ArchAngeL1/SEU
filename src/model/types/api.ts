export type LocalizedString = {
  ka?: string;
  en?: string;
};

export type ProjectStatus =
  | 'planning'
  | 'presale'
  | 'under_construction'
  | 'completed'
  | 'sold_out'
  | 'archived';

export type BuildingStatus =
  | 'planning'
  | 'foundation'
  | 'under_construction'
  | 'finishing'
  | 'completed'
  | 'occupied';

export type UnitStatus =
  | 'available'
  | 'reserved'
  | 'sold'
  | 'not_for_sale';

export type UnitType = 'living' | 'commerce' | 'parking' | 'storage';

export type FurnishingStatus =
  | 'without'
  | 'rough_draft'
  | 'finishing'
  | 'shell_and_core';

export type Currency = 'USD' | 'GEL' | 'EUR';

export interface PriceRange {
  currency?: Currency | string;
  minPrice?: number;
  maxPrice?: number;
  minPricePerSqm?: number;
  maxPricePerSqm?: number;
}

export interface ProjectLocation {
  address: string;
  city?: string;
  district?: string;
}

export interface Project {
  id: string;
  name: LocalizedString;
  description?: LocalizedString;
  location: ProjectLocation;
  status: ProjectStatus;
  startDate?: string | null;
  expectedCompletionDate?: string | null;
  actualCompletionDate?: string | null;
  totalBuildings?: number;
  totalUnits?: number;
  availableUnits?: number;
  totalLandArea?: number;
  images?: string[];
  mainImage?: string;
  videoUrl?: string;
  priceRange?: PriceRange;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FloorPlan {
  name: LocalizedString;
  imageUrl?: string;
  pdfUrl?: string;
  description?: LocalizedString;
}

export interface Building {
  id: string;
  project: string | Project;
  name: LocalizedString;
  block: string;
  location?: { address?: string };
  status: BuildingStatus;
  // The backend no longer stores a `floors` count on the Building — the
  // floor count is derived from the registered Floor[] records. Use
  // `floors.length` from useFloorsByBuilding(buildingId) instead.
  basementFloors: number;
  totalUnits: number;
  availableUnits: number;
  totalSize?: number;
  livableArea?: number;
  parkingSpaces?: number;
  constructionProgress?: number;
  images?: string[];
  mainImage?: string;
  /** Building DTO accepts floor plans, but they are not persisted in the schema. */
  floorPlans?: FloorPlan[];
  description?: LocalizedString;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UnitPrice {
  currency: string;
  amount: number;
  pricePerSqm?: number;
  discount?: number;
  originalPrice?: number;
}

export interface UnitReservation {
  reservedByName?: string;
  reservedByEmail?: string;
  reservedByPhone?: string;
  reservedAt?: string;
  reservationExpiresAt?: string;
  notes?: string;
}

export interface UnitSaleRecord {
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  soldAt?: string;
  finalPrice?: number;
  paymentMethod?: string;
  partnerBank?: string;
  contractNumber?: string;
  notes?: string;
}

export interface Floor {
  id: string;
  building: string | Building;
  project: string | Project;
  floorNumber: number;
  floorImageId?: string;
  totalUnits: number;
  availableUnits: number;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  building: string | Building;
  project: string | Project;
  unitNumber: string;
  block: string;
  floor: string | Floor;
  floorNumber: number;
  entrance?: string;
  status: UnitStatus;
  type: UnitType;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  livingRooms?: number;
  balconies?: number;
  terraces?: number;
  totalSize: number;
  livableArea?: number;
  balconySize?: number;
  terraceSize?: number;
  price: UnitPrice;
  furnishingStatus: FurnishingStatus;
  images?: string[];
  mainImage?: string;
  floorPlanImage?: string;
  videoTourUrl?: string;
  virtualTourUrl?: string;
  description?: LocalizedString;
  reservation?: UnitReservation | null;
  saleRecord?: UnitSaleRecord | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  timestamp: string;
  pagination?: PaginationMeta;
  data: T;
}

export interface ApiError {
  success: false;
  timestamp?: string;
  message?: string;
  error?: { key?: string; message: string; code?: number };
  statusCode?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface UnitStats {
  project: string;
  byStatus: Partial<Record<UnitStatus, number>>;
  byType: Partial<Record<UnitType, number>>;
  pricing: {
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
    totalArea: number;
    avgSize: number;
  };
}

export type CreateProjectInput = {
  name: LocalizedString;
  description?: LocalizedString;
  location: ProjectLocation;
  status?: ProjectStatus;
  startDate?: string;
  expectedCompletionDate?: string;
  actualCompletionDate?: string;
  totalLandArea?: number;
  images?: string[];
  mainImage?: string;
  videoUrl?: string;
  priceRange?: PriceRange;
  isActive?: boolean;
  isFeatured?: boolean;
};

export type UpdateProjectInput = Partial<CreateProjectInput>;

export type CreateBuildingInput = {
  project: string;
  name: LocalizedString;
  block: string;
  location?: { address?: string };
  status?: BuildingStatus;
  basementFloors?: number;
  totalUnits?: number;
  totalSize?: number;
  livableArea?: number;
  parkingSpaces?: number;
  constructionProgress?: number;
  images?: string[];
  mainImage?: string;
  /** Accepted by the create DTO but not persisted by the building schema. */
  floorPlans?: FloorPlan[];
  description?: LocalizedString;
  isActive?: boolean;
};

export type UpdateBuildingInput = Partial<Omit<CreateBuildingInput, 'project'>>;

export type CreateUnitInput = {
  building: string;
  project: string;
  unitNumber: string;
  block: string;
  floorNumber: number;
  entrance?: string;
  status?: UnitStatus;
  type: UnitType;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  livingRooms?: number;
  balconies?: number;
  terraces?: number;
  totalSize: number;
  livableArea?: number;
  balconySize?: number;
  terraceSize?: number;
  price: UnitPrice;
  furnishingStatus?: FurnishingStatus;
  images?: string[];
  mainImage?: string;
  floorPlanImage?: string;
  videoTourUrl?: string;
  virtualTourUrl?: string;
  description?: LocalizedString;
  isActive?: boolean;
};

export type UpdateUnitInput = Partial<CreateUnitInput>;

export type CreateFloorInput = {
  building: string;
  floorNumber: number;
  floorImageId?: string;
};

export type UpdateFloorInput = {
  floorImageId?: string;
};

export interface FloorFilter {
  building?: string;
  project?: string;
}

export interface UnitFilter {
  project?: string;
  building?: string;
  block?: string;
  status?: UnitStatus;
  type?: UnitType;
  furnishingStatus?: FurnishingStatus;
  bedrooms?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  floorNumber?: number;
  minFloor?: number;
  maxFloor?: number;
  minSize?: number;
  maxSize?: number;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  q?: string;
}

export interface BuildingFilter {
  project?: string;
  block?: string;
  status?: BuildingStatus;
  isActive?: boolean;
  q?: string;
}

export interface ProjectFilter {
  status?: ProjectStatus;
  city?: string;
  district?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  q?: string;
}

export interface PaginationInput {
  page?: number;
  limit?: number;
}

export type SortDirection = 'asc' | 'desc';
