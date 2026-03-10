export interface PageableDTO {
  page: number;
  pageSize: number;
}

export interface PageableResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
