export interface BuildingDTO {
  id: string;
  block: string;
}

export interface CreateBuildingDTO {
  projectId: string;
  block: string;
  floorCount: number;
}