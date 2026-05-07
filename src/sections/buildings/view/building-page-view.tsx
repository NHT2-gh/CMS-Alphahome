import React from "react";
import { BuildingsTable } from "../components/";
import { MainContainer } from "@/components/_cms/common/page-layout";

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
      <BuildingsTable />
    </MainContainer>
  );
}
