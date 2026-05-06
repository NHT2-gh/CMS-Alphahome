import { FilterItemConfig } from "@/components/_cms/components/filter/box/type";
import { FurnitureStatus, RoomStatus } from "@/types/room";

export const RoomFilterSchema: FilterItemConfig[] = [
  {
    key: "status",
    label: "Trạng thái",
    type: "checkbox",
    options: Object.entries(RoomStatus).map(([key, value]) => ({
      label: value,
      value: key,
    })),
  },

  {
    key: "furniture_status",
    label: "Nội thất",
    type: "checkbox",
    options: Object.entries(FurnitureStatus).map(([key, value]) => ({
      label: value,
      value: key,
    })),
  },

  // {
  //   key: "price",
  //   label: "Giá",
  //   type: "input-range",
  //   range: [0, 10000000],
  // },
];
