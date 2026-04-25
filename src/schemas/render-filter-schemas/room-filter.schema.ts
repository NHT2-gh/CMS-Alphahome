import { FilterItemConfig } from "@/components/_cms/components/filter/box/type";
import { FurnitureStatus, RoomStatus } from "@/types/room";

export const RoomFilterSchema: FilterItemConfig[] = [
  {
    key: "status",
    label: "Trạng thái",
    type: "button-toggle",
    options: Object.values(RoomStatus).map((status) => ({
      label: status,
      value: status,
    })),
  },

  {
    key: "furniture_status",
    label: "Nội thất",
    type: "checkbox",
    options: Object.values(FurnitureStatus).map((status) => ({
      label: status,
      value: status,
    })),
  },

  // {
  //   key: "price",
  //   label: "Giá",
  //   type: "input-range",
  //   range: [0, 10000000],
  // },
];
