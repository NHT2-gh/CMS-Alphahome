import React from "react";
import { MainContainer } from "@/components/_cms/common";
import { CreateRevenueForm, RevenueExpenditureTable } from "../components";

export default function RevenueExpenditurePageView() {
  return (
    <MainContainer title="Ghi nhận thu chi" links={[{ label: "Sổ thu chi" }]}>
      <CreateRevenueForm />
      <RevenueExpenditureTable />
    </MainContainer>
  );
}
