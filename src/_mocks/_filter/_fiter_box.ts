import {
  FilterItemConfig,
  FilterValue,
} from "@/components/_cms/components/filter/box/type";

export const _filterConfigs: FilterItemConfig[] = [
  {
    key: "price",
    type: "input-range",
    label: "Price Range",
    range: [100000, 1000000],
    options: [
      { label: "Dưới 3 triệu", value: "under-3m" },
      { label: "Từ 3 - 8 triệu", value: "from-3m-to-8m" },
      { label: "Từ 8 - 15 triệu", value: "from-8m-to-15m" },
      { label: "Từ 15 - 25 triệu", value: "from-15m-to-25m" },
      { label: "Trên 25 triệu", value: "over-25m" },
    ],
  },
  {
    key: "brand",
    type: "checkbox",
    label: "Brand",
    options: [
      { label: "Apple", value: "apple" },
      { label: "Samsung", value: "samsung" },
      { label: "Sony", value: "sony" },
      { label: "LG", value: "lg" },
      { label: "Xiaomi", value: "xiaomi" },
      { label: "Huawei", value: "huawei" },
    ],
  },
  {
    key: "category",
    type: "button-toggle",
    label: "Category",
    options: [
      { label: "Smartphones", value: "smartphones" },
      { label: "Laptops", value: "laptops" },
      { label: "Tablets", value: "tablets" },
      { label: "Accessories", value: "accessories" },
      { label: "Gaming", value: "gaming" },
    ],
  },
];

export const _filterValues: Record<string, FilterValue> = {
  price: [100000, 1000000],
  brand: ["apple", "samsung"],
  category: ["smartphones", "laptops"],
};
