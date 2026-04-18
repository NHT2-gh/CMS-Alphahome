import { FilterItemConfig } from "@/components/_cms/components/filter/box/type";
import { TransactionType } from "@/types/transcription";

export const TransactionFilterSchema: FilterItemConfig[] = [
  {
    key: "transtions-date",
    label: "Ngày giao dịch",
    type: "date-range",
    range: ["", ""],
  },
];
