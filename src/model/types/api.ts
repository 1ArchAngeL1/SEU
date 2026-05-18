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

export type RoomType =
  | 'bedroom'
  | 'living_room'
  | 'kitchen'
  | 'bathroom'
  | 'toilet'
  | 'hall'
  | 'balcony'
  | 'terrace'
  | 'storage'
  | 'other';

export interface Room {
  name: string;
  type: RoomType;
  size?: number;
  description?: string;
}

export type SyncRoomsInput = {
  rooms: Room[];
};

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
  renderImage?: string;
  videoUrl?: string;
  priceRange?: PriceRange;
  googleMapLink?: string;
  minSizeApartment?: number;
  maxSizeApartment?: number;
  benefits?: string;
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

/** A single percentage-based polygon point (0-100) as stored by the backend. */
export interface PolygonPoint {
  x: number;
  y: number;
}

/**
 * Admin-side polygon entry used in the PolygonsEditor.
 * `raw` holds the flat pixel-coord string the user types (e.g. "719,359,719,559,…").
 */
export interface PolygonEntry {
  raw: string;
  label?: string;
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
  renderImage?: string;
  polygon?: PolygonPoint[];
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
  renderImage?: string;
  polygon?: PolygonPoint[];
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
  rooms?: Room[];
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
  twoDContent?: string;
  threeDContent?: string;
  videoTourUrl?: string;
  virtualTourUrl?: string;
  renderImage?: string;
  polygon?: PolygonPoint[];
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
  renderImage?: string;
  videoUrl?: string;
  priceRange?: PriceRange;
  googleMapLink?: string | null;
  minSizeApartment?: number;
  maxSizeApartment?: number;
  benefits?: string;
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
  renderImage?: string;
  polygon?: PolygonPoint[];
  rawPolygon?: string;
  imageWidth?: number;
  imageHeight?: number;
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
  rooms?: Room[];
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
  twoDContent?: string;
  threeDContent?: string;
  videoTourUrl?: string;
  virtualTourUrl?: string;
  renderImage?: string;
  polygon?: PolygonPoint[];
  rawPolygon?: string;
  imageWidth?: number;
  imageHeight?: number;
  description?: LocalizedString;
  isActive?: boolean;
};

export type UpdateUnitInput = Partial<CreateUnitInput>;

export type CreateFloorInput = {
  building: string;
  floorNumber: number;
  floorImageId?: string;
  renderImage?: string;
  polygon?: PolygonPoint[];
  rawPolygon?: string;
  imageWidth?: number;
  imageHeight?: number;
};

export type UpdateFloorInput = {
  floorImageId?: string;
  renderImage?: string;
  polygon?: PolygonPoint[];
  rawPolygon?: string;
  imageWidth?: number;
  imageHeight?: number;
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

export interface Partner {
  id: string;
  name: string;
  description?: string;
  logoId?: string;
  mail?: string;
  phone?: string;
  address?: string;
  facebookLink?: string;
  discountPercentage?: number;
  createdAt: string;
  updatedAt: string;
}

export type CreatePartnerInput = {
  name: string;
  description?: string;
  logoId?: string;
  mail?: string;
  phone?: string;
  address?: string;
  facebookLink?: string;
  discountPercentage?: number;
};

export type UpdatePartnerInput = Partial<CreatePartnerInput>;

export type ContactStatus = 'open' | 'closed';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateContactInput = {
  name: string;
  phone: string;
  email?: string;
};

export type UpdateContactStatusInput = {
  status: ContactStatus;
};

export interface NewsArticle {
  id: string;
  header: string;
  description: string;
  image: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type CreateNewsInput = {
  header: string;
  description: string;
  image?: string[];
  tags?: string[];
};

export type UpdateNewsInput = Partial<CreateNewsInput>;

export interface NewsFilter {
  q?: string;
}

export interface ApartmentType {
  id: string;
  project: string;
  name?: LocalizedString;
  bedrooms: number;
  sizeFrom: number;
  sizeTo: number;
  image?: string;
  description?: LocalizedString;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateApartmentTypeInput = {
  project: string;
  name?: LocalizedString;
  bedrooms: number;
  sizeFrom: number;
  sizeTo: number;
  image?: string;
  description?: LocalizedString;
  isActive?: boolean;
};

export type UpdateApartmentTypeInput = Partial<Omit<CreateApartmentTypeInput, 'project'>>;
