export interface Spec {
  id: number;
  slug: string;
  name: string;
  en_name: string;
  display_name: string;
  description?: string;
  data_type: 'text' | 'multi-text' | 'integer' | 'float' | 'char' | 'boolean' | 'date' | 'datetime' | 'color' | 'ip' | 'size2d' | 'size3d' | 'integer_range' | 'float_range';
  unit_class_id: number | null;
  unit_id: number | null;
  status: 'active' | 'inactive';
}

export const specs: Spec[] = [
  { id: 1, slug: 'gpu-model', name: 'Model GPU', en_name: 'GPU Model', display_name: 'GPU', data_type: 'text', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 2, slug: 'gpu-manufacturer', name: 'Hãng sản xuất GPU', en_name: 'GPU Manufacturer', display_name: 'Hãng GPU', data_type: 'text', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 3, slug: 'base-clock', name: 'Xung nhịp cơ bản', en_name: 'Base Clock', display_name: 'Base Clock', data_type: 'integer', unit_class_id: 1, unit_id: 1, status: 'active' },
  { id: 4, slug: 'boost-clock', name: 'Xung nhịp tăng cường', en_name: 'Boost Clock', display_name: 'Boost Clock', data_type: 'integer', unit_class_id: 1, unit_id: 1, status: 'active' },
  { id: 5, slug: 'memory-size', name: 'Dung lượng bộ nhớ', en_name: 'Memory Size', display_name: 'VRAM', data_type: 'integer', unit_class_id: 2, unit_id: 4, status: 'active' },
  { id: 6, slug: 'memory-type', name: 'Loại bộ nhớ', en_name: 'Memory Type', display_name: 'Memory Type', data_type: 'text', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 7, slug: 'memory-bus', name: 'Bus bộ nhớ', en_name: 'Memory Bus', display_name: 'Memory Bus', data_type: 'integer', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 8, slug: 'memory-bandwidth', name: 'Băng thông bộ nhớ', en_name: 'Memory Bandwidth', display_name: 'Bandwidth', data_type: 'float', unit_class_id: 5, unit_id: 7, status: 'active' },
  { id: 9, slug: 'cuda-cores', name: 'Số nhân CUDA', en_name: 'CUDA Cores', display_name: 'CUDA Cores', data_type: 'integer', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 10, slug: 'directx-support', name: 'Hỗ trợ DirectX', en_name: 'DirectX Support', display_name: 'DirectX', data_type: 'text', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 11, slug: 'opengl-support', name: 'Hỗ trợ OpenGL', en_name: 'OpenGL Support', display_name: 'OpenGL', data_type: 'text', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 12, slug: 'power-consumption', name: 'Công suất tiêu thụ', en_name: 'Power Consumption', display_name: 'TDP', data_type: 'integer', unit_class_id: 4, unit_id: 6, status: 'active' },
  { id: 13, slug: 'recommended-psu', name: 'Nguồn khuyến nghị', en_name: 'Recommended PSU', display_name: 'PSU', data_type: 'integer', unit_class_id: 4, unit_id: 6, status: 'active' },
  { id: 14, slug: 'display-ports', name: 'Số cổng DisplayPort', en_name: 'DisplayPort Ports', display_name: 'DisplayPort', data_type: 'integer', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 15, slug: 'hdmi-ports', name: 'Số cổng HDMI', en_name: 'HDMI Ports', display_name: 'HDMI', data_type: 'integer', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 16, slug: 'card-length', name: 'Chiều dài card', en_name: 'Card Length', display_name: 'Length', data_type: 'integer', unit_class_id: 3, unit_id: 5, status: 'active' },
  { id: 17, slug: 'cooling-type', name: 'Loại tản nhiệt', en_name: 'Cooling Type', display_name: 'Cooling', data_type: 'text', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 18, slug: 'ray-tracing', name: 'Hỗ trợ Ray Tracing', en_name: 'Ray Tracing Support', display_name: 'Ray Tracing', data_type: 'boolean', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 19, slug: 'dlss-support', name: 'Hỗ trợ DLSS', en_name: 'DLSS Support', display_name: 'DLSS', data_type: 'boolean', unit_class_id: null, unit_id: null, status: 'active' },

  { id: 20, slug: 'mouse-sensor', name: 'Loại cảm biến', en_name: 'Sensor Type', display_name: 'Sensor', data_type: 'text', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 21, slug: 'mouse-dpi', name: 'DPI tối đa', en_name: 'Max DPI', display_name: 'DPI', data_type: 'integer', unit_class_id: 7, unit_id: 10, status: 'active' },
  { id: 22, slug: 'mouse-buttons', name: 'Số nút bấm', en_name: 'Number of Buttons', display_name: 'Buttons', data_type: 'integer', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 23, slug: 'mouse-weight', name: 'Trọng lượng', en_name: 'Weight', display_name: 'Weight', data_type: 'integer', unit_class_id: 6, unit_id: 8, status: 'active' },
  { id: 24, slug: 'mouse-connection', name: 'Kết nối', en_name: 'Connection Type', display_name: 'Connection', data_type: 'multi-text', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 25, slug: 'mouse-rgb', name: 'Đèn RGB', en_name: 'RGB Lighting', display_name: 'RGB', data_type: 'boolean', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 26, slug: 'mouse-polling-rate', name: 'Tần số polling', en_name: 'Polling Rate', display_name: 'Polling Rate', data_type: 'integer', unit_class_id: 8, unit_id: 13, status: 'active' },

  { id: 27, slug: 'keyboard-switch', name: 'Loại switch', en_name: 'Switch Type', display_name: 'Switch', data_type: 'text', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 28, slug: 'keyboard-layout', name: 'Layout', en_name: 'Layout', display_name: 'Layout', data_type: 'text', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 29, slug: 'keyboard-size', name: 'Kích thước', en_name: 'Keyboard Size', display_name: 'Size', data_type: 'text', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 30, slug: 'keyboard-connection', name: 'Kết nối', en_name: 'Connection Type', display_name: 'Connection', data_type: 'text', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 31, slug: 'keyboard-rgb', name: 'Đèn RGB', en_name: 'RGB Lighting', display_name: 'RGB', data_type: 'boolean', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 32, slug: 'keyboard-hotswap', name: 'Hỗ trợ Hot-swap', en_name: 'Hot-swap Support', display_name: 'Hot-swap', data_type: 'boolean', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 33, slug: 'keyboard-keycaps', name: 'Chất liệu keycap', en_name: 'Keycap Material', display_name: 'Keycaps', data_type: 'text', unit_class_id: null, unit_id: null, status: 'active' },

  { id: 34, slug: 'monitor-size', name: 'Kích thước màn hình', en_name: 'Screen Size', display_name: 'Size', data_type: 'float', unit_class_id: 3, unit_id: 9, status: 'active' },
  { id: 35, slug: 'monitor-resolution', name: 'Độ phân giải', en_name: 'Resolution', display_name: 'Resolution', data_type: 'text', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 36, slug: 'monitor-refresh-rate', name: 'Tần số quét', en_name: 'Refresh Rate', display_name: 'Refresh Rate', data_type: 'integer', unit_class_id: 8, unit_id: 13, status: 'active' },
  { id: 37, slug: 'monitor-response-time', name: 'Thời gian phản hồi', en_name: 'Response Time', display_name: 'Response Time', data_type: 'integer', unit_class_id: 8, unit_id: 12, status: 'active' },
  { id: 38, slug: 'monitor-panel', name: 'Loại panel', en_name: 'Panel Type', display_name: 'Panel', data_type: 'text', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 39, slug: 'monitor-curved', name: 'Màn hình cong', en_name: 'Curved Display', display_name: 'Curved', data_type: 'boolean', unit_class_id: null, unit_id: null, status: 'active' },
  { id: 40, slug: 'monitor-hdr', name: 'Hỗ trợ HDR', en_name: 'HDR Support', display_name: 'HDR', data_type: 'boolean', unit_class_id: null, unit_id: null, status: 'active' }
];
