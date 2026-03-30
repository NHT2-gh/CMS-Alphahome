import { CreateMonthlyBillsResponse, FilteredBillResponse } from "@/types/bill";

export const adaptMonthlyBillsResponse = (
  data: CreateMonthlyBillsResponse[],
): FilteredBillResponse => {
  return {
    success: data.filter((item) => item.status === "success"),
    failed: data.filter((item) => item.status == "error"),
    already_exists: data.filter((item) => item.status === "already_exists"),
  };
};
