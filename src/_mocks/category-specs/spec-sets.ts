export interface SpecSet {
  id: number;
  category_id: string;
  parent_id: number | null;
  name: string;
  order: number;
  is_highlight?: boolean;
  status: 'active' | 'inactive';
}

export const specSets: SpecSet[] = [
  {
    id: 2,
    category_id: '550e8400-e29b-41d4-a716-446655440000',
    parent_id: null,
    name: 'Thông tin GPU',
    order: 0,
    status: 'active'
  },
  {
    id: 3,
    category_id: '550e8400-e29b-41d4-a716-446655440000',
    parent_id: null,
    name: 'Bộ nhớ',
    order: 1,
    status: 'active'
  },
  {
    id: 4,
    category_id: '550e8400-e29b-41d4-a716-446655440000',
    parent_id: null,
    name: 'Kết nối & Nguồn',
    order: 2,
    status: 'active'
  },
  {
    id: 5,
    category_id: '550e8400-e29b-41d4-a716-446655440000',
    parent_id: null,
    name: 'Vật lý',
    order: 3,
    status: 'active'
  },
  {
    id: 15,
    category_id: '550e8400-e29b-41d4-a716-446655440000',
    parent_id: null,
    name: 'Thông số nổi bật',
    order: 4,
    is_highlight: true,
    status: 'active'
  },

  {
    id: 7,
    category_id: '660e8400-e29b-41d4-a716-446655440001',
    parent_id: null,
    name: 'Thông số kỹ thuật',
    order: 0,
    status: 'active'
  },
  {
    id: 8,
    category_id: '660e8400-e29b-41d4-a716-446655440001',
    parent_id: null,
    name: 'Tính năng',
    order: 1,
    status: 'active'
  },
  {
    id: 16,
    category_id: '660e8400-e29b-41d4-a716-446655440001',
    parent_id: null,
    name: 'Thông số nổi bật',
    order: 2,
    is_highlight: true,
    status: 'active'
  },

  {
    id: 10,
    category_id: '770e8400-e29b-41d4-a716-446655440002',
    parent_id: null,
    name: 'Thông tin chung',
    order: 0,
    status: 'active'
  },
  {
    id: 11,
    category_id: '770e8400-e29b-41d4-a716-446655440002',
    parent_id: null,
    name: 'Tính năng',
    order: 1,
    status: 'active'
  },
  {
    id: 17,
    category_id: '770e8400-e29b-41d4-a716-446655440002',
    parent_id: null,
    name: 'Thông số nổi bật',
    order: 2,
    is_highlight: true,
    status: 'active'
  },

  {
    id: 13,
    category_id: '880e8400-e29b-41d4-a716-446655440003',
    parent_id: null,
    name: 'Màn hình',
    order: 0,
    status: 'active'
  },
  {
    id: 14,
    category_id: '880e8400-e29b-41d4-a716-446655440003',
    parent_id: null,
    name: 'Hiệu năng',
    order: 1,
    status: 'active'
  },
  {
    id: 18,
    category_id: '880e8400-e29b-41d4-a716-446655440003',
    parent_id: null,
    name: 'Thông số nổi bật',
    order: 2,
    is_highlight: true,
    status: 'active'
  }
];
