export interface ProjectDTO {
  id: string;
  name: string;
  address: string;
}

export interface UpdateProjectDTO {
  name?: string;
  address?: string;
}
