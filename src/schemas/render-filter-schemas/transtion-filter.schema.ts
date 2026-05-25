import { FilterItemConfig } from "@/components/_cms/components/filter/box/type";
import { TransactionType } from "@/types/transcription";

export const TransactionFilterSchema: FilterItemConfig[] = [
  {
    key: "type",
    label: "Loại giao dịch",
    type: "button-toggle",
    isMultiple: false,
    options: Object.entries(TransactionType).map(([key, value]) => ({
      value: key,
      label: value,
    })),
  },
  {
    key: "transaction_date",
    label: "Ngày giao dịch",
    type: "date-range",
    range: ["", ""],
  },

  {
    key: "is_linked_to_room",
    type: "switch-filter",
    label: "Liên kết phòng",
  },
];
