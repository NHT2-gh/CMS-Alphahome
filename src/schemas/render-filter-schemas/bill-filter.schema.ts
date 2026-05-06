import { FilterItemConfig } from "@/components/_cms/components/filter/box/type";
import { BillStatus } from "@/types/bill";

export const BillFilterSchema: FilterItemConfig[] = [
  {
    key: "bill_status",
    label: "Trạng thái",
    type: "checkbox",
    options: Object.entries(BillStatus).map(([key, value]) => ({
      label: value,
      value: key,
    })),
  },
  {
    key: "created_at",
    label: "Thời gian tạo",
    type: "date-range",
    range: ["", ""],
  },
];
