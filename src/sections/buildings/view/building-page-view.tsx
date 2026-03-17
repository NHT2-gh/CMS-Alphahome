import { MainContainer } from "@/components/_cms/common";
import React from "react";
import DataTable from "../components/data-table";

export default async function BuildingPageView() {
  return (
    <MainContainer
      title="Quản lý tòa nhà"
      links={[
        {
          label: "Danh sách tòa nhà",
        },
      ]}
    >
      <DataTable />
    </MainContainer>
  );
}
