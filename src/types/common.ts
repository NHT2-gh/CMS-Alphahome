// Other types used across the application
export interface Pagination {
  page: number;
  limit: number;
  total?: number;
}

export interface MutationResult {
  success: boolean;
  message: string;
}

export interface ResponseData<T> {
  data: T;
  count: number;
}
