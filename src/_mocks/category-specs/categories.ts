export interface Category {
  id: string;
  name: string;
  slug: string;
}

export const categories: Category[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Card màn hình',
    slug: 'card-man-hinh'
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    name: 'Chuột máy tính',
    slug: 'chuot-may-tinh'
  },
  {
    id: '770e8400-e29b-41d4-a716-446655440002',
    name: 'Bàn phím (Keyboard)',
    slug: 'ban-phim'
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440003',
    name: 'Màn hình (Monitor)',
    slug: 'man-hinh'
  }
];
