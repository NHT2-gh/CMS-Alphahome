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
    key: "month_date",
    label: "Kì thanh toán",
    type: "date-range",
    range: ["", ""],
  },
];
