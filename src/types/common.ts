// Other types used across the application
export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export type FilterValue = string | string[] | number | [number, number];
