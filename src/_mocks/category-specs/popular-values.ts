export interface PopularValue {
  id: number;
  product_spec_id: number;
  name: string;
  value: string;
  order: number;
  status: 'active' | 'inactive';
}

export const popularValues: PopularValue[] = [
  { id: 1, product_spec_id: 1, name: 'NVIDIA GeForce RTX 4090', value: 'NVIDIA GeForce RTX 4090', order: 0, status: 'active' },
  { id: 2, product_spec_id: 1, name: 'NVIDIA GeForce RTX 4080', value: 'NVIDIA GeForce RTX 4080', order: 1, status: 'active' },
  { id: 3, product_spec_id: 1, name: 'NVIDIA GeForce RTX 4070 Ti', value: 'NVIDIA GeForce RTX 4070 Ti', order: 2, status: 'active' },
  { id: 4, product_spec_id: 1, name: 'AMD Radeon RX 7900 XTX', value: 'AMD Radeon RX 7900 XTX', order: 3, status: 'active' },
  { id: 5, product_spec_id: 1, name: 'AMD Radeon RX 7900 XT', value: 'AMD Radeon RX 7900 XT', order: 4, status: 'active' },

  { id: 6, product_spec_id: 2, name: 'NVIDIA', value: 'NVIDIA', order: 0, status: 'active' },
  { id: 7, product_spec_id: 2, name: 'AMD', value: 'AMD', order: 1, status: 'active' },
  { id: 8, product_spec_id: 2, name: 'Intel', value: 'Intel', order: 2, status: 'active' },

  { id: 9, product_spec_id: 3, name: '1500 MHz', value: '1500', order: 0, status: 'active' },
  { id: 10, product_spec_id: 3, name: '1800 MHz', value: '1800', order: 1, status: 'active' },
  { id: 11, product_spec_id: 3, name: '2000 MHz', value: '2000', order: 2, status: 'active' },
  { id: 12, product_spec_id: 3, name: '2200 MHz', value: '2200', order: 3, status: 'active' },

  { id: 17, product_spec_id: 5, name: '8 GB', value: '8', order: 0, status: 'active' },
  { id: 18, product_spec_id: 5, name: '12 GB', value: '12', order: 1, status: 'active' },
  { id: 19, product_spec_id: 5, name: '16 GB', value: '16', order: 2, status: 'active' },
  { id: 20, product_spec_id: 5, name: '24 GB', value: '24', order: 3, status: 'active' },

  { id: 21, product_spec_id: 6, name: 'GDDR6', value: 'GDDR6', order: 0, status: 'active' },
  { id: 22, product_spec_id: 6, name: 'GDDR6X', value: 'GDDR6X', order: 1, status: 'active' },

  { id: 62, product_spec_id: 21, name: '8000 DPI', value: '8000', order: 0, status: 'active' },
  { id: 63, product_spec_id: 21, name: '12000 DPI', value: '12000', order: 1, status: 'active' },
  { id: 64, product_spec_id: 21, name: '16000 DPI', value: '16000', order: 2, status: 'active' },
  { id: 65, product_spec_id: 21, name: '25600 DPI', value: '25600', order: 3, status: 'active' },

  { id: 81, product_spec_id: 27, name: 'Cherry MX Red', value: 'Cherry MX Red', order: 0, status: 'active' },
  { id: 82, product_spec_id: 27, name: 'Cherry MX Blue', value: 'Cherry MX Blue', order: 1, status: 'active' },
  { id: 83, product_spec_id: 27, name: 'Cherry MX Brown', value: 'Cherry MX Brown', order: 2, status: 'active' },
  { id: 84, product_spec_id: 27, name: 'Gateron Yellow', value: 'Gateron Yellow', order: 3, status: 'active' },

  { id: 105, product_spec_id: 35, name: '1920x1080 (Full HD)', value: '1920x1080', order: 0, status: 'active' },
  { id: 106, product_spec_id: 35, name: '2560x1440 (2K)', value: '2560x1440', order: 1, status: 'active' },
  { id: 107, product_spec_id: 35, name: '3440x1440 (UltraWide)', value: '3440x1440', order: 2, status: 'active' },
  { id: 108, product_spec_id: 35, name: '3840x2160 (4K)', value: '3840x2160', order: 3, status: 'active' },

  { id: 109, product_spec_id: 36, name: '60 Hz', value: '60', order: 0, status: 'active' },
  { id: 110, product_spec_id: 36, name: '75 Hz', value: '75', order: 1, status: 'active' },
  { id: 111, product_spec_id: 36, name: '144 Hz', value: '144', order: 2, status: 'active' },
  { id: 112, product_spec_id: 36, name: '165 Hz', value: '165', order: 3, status: 'active' },
  { id: 113, product_spec_id: 36, name: '240 Hz', value: '240', order: 4, status: 'active' },
];
