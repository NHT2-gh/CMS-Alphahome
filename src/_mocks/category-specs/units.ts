export interface UnitClass {
  id: number;
  name: string;
  display_name?: string;
  order: number;
  status?: 'active' | 'inactive';
}

export interface Unit {
  id: number;
  unit_class_id: number;
  name: string;
  display_name: string;
  order: number;
}

export const unitClasses: UnitClass[] = [
  { id: 1, name: 'frequency', display_name: 'Tần số', order: 0 },
  { id: 2, name: 'storage', display_name: 'Dung lượng', order: 1 },
  { id: 3, name: 'length', display_name: 'Chiều dài', order: 2 },
  { id: 4, name: 'power', display_name: 'Công suất', order: 3 },
  { id: 5, name: 'bandwidth', display_name: 'Băng thông', order: 4 },
  { id: 6, name: 'weight', display_name: 'Trọng lượng', order: 5 },
  { id: 7, name: 'resolution', display_name: 'Độ phân giải', order: 6 },
  { id: 8, name: 'time', display_name: 'Thời gian', order: 7 }
];

export const units: Unit[] = [
  { id: 1, unit_class_id: 1, name: 'megahertz', display_name: 'MHz', order: 0 },
  { id: 2, unit_class_id: 1, name: 'gigahertz', display_name: 'GHz', order: 1 },
  { id: 3, unit_class_id: 2, name: 'megabyte', display_name: 'MB', order: 0 },
  { id: 4, unit_class_id: 2, name: 'gigabyte', display_name: 'GB', order: 1 },
  { id: 5, unit_class_id: 3, name: 'millimeter', display_name: 'mm', order: 0 },
  { id: 6, unit_class_id: 4, name: 'watt', display_name: 'W', order: 0 },
  { id: 7, unit_class_id: 5, name: 'gigabyte_per_second', display_name: 'GB/s', order: 0 },
  { id: 8, unit_class_id: 6, name: 'gram', display_name: 'g', order: 0 },
  { id: 9, unit_class_id: 3, name: 'inch', display_name: 'inch', order: 1 },
  { id: 10, unit_class_id: 7, name: 'dpi', display_name: 'DPI', order: 0 },
  { id: 11, unit_class_id: 7, name: 'pixel', display_name: 'px', order: 1 },
  { id: 12, unit_class_id: 8, name: 'millisecond', display_name: 'ms', order: 0 },
  { id: 13, unit_class_id: 8, name: 'hertz', display_name: 'Hz', order: 1 }
];
