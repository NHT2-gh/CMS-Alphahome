import { FilterValue } from "@/components/_cms/components/filter/box/type";

// Other types used across the application
export interface Pagination {
  page?: number;
  limit?: number;
  total?: number;
}

export interface MutationResult {
  success: boolean;
  message: string;
}

export interface ResponseStandard<T> {
  data: T;
  pagination: Pagination;
}

export interface ResponseWithStatics<T> extends ResponseStandard<T> {
  statics: Record<string, number>;
}

export interface GetWithFilterParams {
  page?: number;
  limit?: number;
  searchText?: string;
  filters?: Record<string, FilterValue>;
}
