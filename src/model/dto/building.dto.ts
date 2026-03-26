export interface BuildingDTO {
  id: string;
  block: string;
  floorCount: number;
  projectId: string;
}

export interface CreateBuildingDTO {
  projectId: string;
  block: string;
  floorCount: number;
}

export interface UpdateBuildingDTO {
  block?: string;
  floorCount?: number;
}
