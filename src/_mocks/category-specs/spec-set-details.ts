export interface SpecSetDetail {
  product_spec_set_id: number;
  product_spec_id: number;
  is_required: boolean;
  is_searchable: boolean;
  is_filterable: boolean;
  is_sortable: boolean;
  is_comparable: boolean;
  is_priority: boolean;
  order: number;
  status: 'draft' | 'pending' | 'active' | 'inactive' | 'banned' | 'deleted';
}

export const specSetDetails: SpecSetDetail[] = [
  { product_spec_set_id: 2, product_spec_id: 1, is_required: true, is_searchable: true, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: true, order: 0, status: 'active' },
  { product_spec_set_id: 2, product_spec_id: 2, is_required: true, is_searchable: true, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: true, order: 1, status: 'active' },
  { product_spec_set_id: 2, product_spec_id: 3, is_required: true, is_searchable: false, is_filterable: true, is_sortable: true, is_comparable: true, is_priority: false, order: 2, status: 'active' },
  { product_spec_set_id: 2, product_spec_id: 4, is_required: true, is_searchable: false, is_filterable: true, is_sortable: true, is_comparable: true, is_priority: false, order: 3, status: 'active' },
  { product_spec_set_id: 2, product_spec_id: 9, is_required: false, is_searchable: false, is_filterable: true, is_sortable: true, is_comparable: true, is_priority: false, order: 4, status: 'active' },
  { product_spec_set_id: 2, product_spec_id: 18, is_required: false, is_searchable: false, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: false, order: 5, status: 'active' },
  { product_spec_set_id: 2, product_spec_id: 19, is_required: false, is_searchable: false, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: false, order: 6, status: 'active' },

  { product_spec_set_id: 3, product_spec_id: 5, is_required: true, is_searchable: false, is_filterable: true, is_sortable: true, is_comparable: true, is_priority: true, order: 0, status: 'active' },
  { product_spec_set_id: 3, product_spec_id: 6, is_required: true, is_searchable: true, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: false, order: 1, status: 'active' },
  { product_spec_set_id: 3, product_spec_id: 7, is_required: true, is_searchable: false, is_filterable: true, is_sortable: true, is_comparable: true, is_priority: false, order: 2, status: 'active' },
  { product_spec_set_id: 3, product_spec_id: 8, is_required: false, is_searchable: false, is_filterable: true, is_sortable: true, is_comparable: true, is_priority: false, order: 3, status: 'active' },
  { product_spec_set_id: 3, product_spec_id: 2, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 4, status: 'active' },

  { product_spec_set_id: 4, product_spec_id: 10, is_required: false, is_searchable: false, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: false, order: 0, status: 'active' },
  { product_spec_set_id: 4, product_spec_id: 11, is_required: false, is_searchable: false, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: false, order: 1, status: 'active' },
  { product_spec_set_id: 4, product_spec_id: 12, is_required: true, is_searchable: false, is_filterable: true, is_sortable: true, is_comparable: true, is_priority: false, order: 2, status: 'active' },
  { product_spec_set_id: 4, product_spec_id: 13, is_required: true, is_searchable: false, is_filterable: true, is_sortable: true, is_comparable: true, is_priority: false, order: 3, status: 'active' },
  { product_spec_set_id: 4, product_spec_id: 14, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: true, is_priority: false, order: 4, status: 'active' },
  { product_spec_set_id: 4, product_spec_id: 15, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: true, is_priority: false, order: 5, status: 'active' },
  { product_spec_set_id: 4, product_spec_id: 1, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 6, status: 'active' },

  { product_spec_set_id: 5, product_spec_id: 16, is_required: true, is_searchable: false, is_filterable: true, is_sortable: true, is_comparable: true, is_priority: false, order: 0, status: 'active' },
  { product_spec_set_id: 5, product_spec_id: 17, is_required: true, is_searchable: true, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: false, order: 1, status: 'active' },
  { product_spec_set_id: 5, product_spec_id: 9, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 2, status: 'active' },

  { product_spec_set_id: 15, product_spec_id: 1, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 0, status: 'active' },
  { product_spec_set_id: 15, product_spec_id: 2, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 1, status: 'active' },
  { product_spec_set_id: 15, product_spec_id: 4, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 2, status: 'active' },
  { product_spec_set_id: 15, product_spec_id: 5, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 3, status: 'active' },
  { product_spec_set_id: 15, product_spec_id: 9, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 4, status: 'active' },
  { product_spec_set_id: 15, product_spec_id: 12, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 5, status: 'active' },

  { product_spec_set_id: 7, product_spec_id: 20, is_required: true, is_searchable: true, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: true, order: 0, status: 'active' },
  { product_spec_set_id: 7, product_spec_id: 21, is_required: true, is_searchable: false, is_filterable: true, is_sortable: true, is_comparable: true, is_priority: true, order: 1, status: 'active' },
  { product_spec_set_id: 7, product_spec_id: 22, is_required: false, is_searchable: false, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: false, order: 2, status: 'active' },
  { product_spec_set_id: 7, product_spec_id: 23, is_required: true, is_searchable: false, is_filterable: true, is_sortable: true, is_comparable: true, is_priority: false, order: 3, status: 'active' },
  { product_spec_set_id: 7, product_spec_id: 26, is_required: false, is_searchable: false, is_filterable: true, is_sortable: true, is_comparable: true, is_priority: false, order: 4, status: 'active' },

  { product_spec_set_id: 8, product_spec_id: 24, is_required: true, is_searchable: true, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: false, order: 0, status: 'active' },
  { product_spec_set_id: 8, product_spec_id: 25, is_required: false, is_searchable: false, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: false, order: 1, status: 'active' },

  { product_spec_set_id: 16, product_spec_id: 20, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 0, status: 'active' },
  { product_spec_set_id: 16, product_spec_id: 21, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 1, status: 'active' },
  { product_spec_set_id: 16, product_spec_id: 23, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 2, status: 'active' },
  { product_spec_set_id: 16, product_spec_id: 24, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 3, status: 'active' },

  { product_spec_set_id: 10, product_spec_id: 27, is_required: true, is_searchable: true, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: true, order: 0, status: 'active' },
  { product_spec_set_id: 10, product_spec_id: 28, is_required: true, is_searchable: true, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: false, order: 1, status: 'active' },
  { product_spec_set_id: 10, product_spec_id: 29, is_required: true, is_searchable: true, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: false, order: 2, status: 'active' },
  { product_spec_set_id: 10, product_spec_id: 30, is_required: true, is_searchable: true, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: false, order: 3, status: 'active' },
  { product_spec_set_id: 10, product_spec_id: 33, is_required: false, is_searchable: false, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: false, order: 4, status: 'active' },

  { product_spec_set_id: 11, product_spec_id: 31, is_required: false, is_searchable: false, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: false, order: 0, status: 'active' },
  { product_spec_set_id: 11, product_spec_id: 32, is_required: false, is_searchable: false, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: false, order: 1, status: 'active' },

  { product_spec_set_id: 17, product_spec_id: 27, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 0, status: 'active' },
  { product_spec_set_id: 17, product_spec_id: 28, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 1, status: 'active' },
  { product_spec_set_id: 17, product_spec_id: 29, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 2, status: 'active' },
  { product_spec_set_id: 17, product_spec_id: 30, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 3, status: 'active' },
  { product_spec_set_id: 17, product_spec_id: 31, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 4, status: 'active' },

  { product_spec_set_id: 13, product_spec_id: 34, is_required: true, is_searchable: false, is_filterable: true, is_sortable: true, is_comparable: true, is_priority: true, order: 0, status: 'active' },
  { product_spec_set_id: 13, product_spec_id: 35, is_required: true, is_searchable: true, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: true, order: 1, status: 'active' },
  { product_spec_set_id: 13, product_spec_id: 38, is_required: true, is_searchable: true, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: false, order: 2, status: 'active' },
  { product_spec_set_id: 13, product_spec_id: 39, is_required: false, is_searchable: false, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: false, order: 3, status: 'active' },

  { product_spec_set_id: 14, product_spec_id: 36, is_required: true, is_searchable: false, is_filterable: true, is_sortable: true, is_comparable: true, is_priority: true, order: 0, status: 'active' },
  { product_spec_set_id: 14, product_spec_id: 37, is_required: true, is_searchable: false, is_filterable: true, is_sortable: true, is_comparable: true, is_priority: false, order: 1, status: 'active' },
  { product_spec_set_id: 14, product_spec_id: 40, is_required: false, is_searchable: false, is_filterable: true, is_sortable: false, is_comparable: true, is_priority: false, order: 2, status: 'active' },

  { product_spec_set_id: 18, product_spec_id: 34, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 0, status: 'active' },
  { product_spec_set_id: 18, product_spec_id: 35, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 1, status: 'active' },
  { product_spec_set_id: 18, product_spec_id: 36, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 2, status: 'active' },
  { product_spec_set_id: 18, product_spec_id: 38, is_required: false, is_searchable: false, is_filterable: false, is_sortable: false, is_comparable: false, is_priority: false, order: 3, status: 'active' }
];
