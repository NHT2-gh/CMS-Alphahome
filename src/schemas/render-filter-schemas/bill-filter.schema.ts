import { FilterItemConfig } from "@/components/_cms/components/filter/box/type";
import { BillStatus } from "@/types/bill";

export const BillFilterSchema: FilterItemConfig[] = [
  {
    key: "month_date",
    label: "Kì thanh toán",
    type: "date-range",
    range: ["", ""],
  },
];
