import { RevenueExpenditurePageView } from "@/sections/revenue-expenditure/view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý thu chi | AlphaHome",
  description: "Quản lý thu chi AlphaHome",
};

export default function RevenueExpenditureBookPage() {
  return <RevenueExpenditurePageView />;
}
