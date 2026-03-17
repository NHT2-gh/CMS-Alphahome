"use client";
import React from "react";

import { MainContainer } from "@/components/_cms/common";
import { MainContentBuildingDetail } from "../components";
import { APP_ROUTES } from "@/config/app-routes";
import { BuildingProvider, useBuilding } from "@/context/BuildingContext";
import { Building } from "@/types/building";

interface BuildingDetailPageViewProps {
  building: Building;
}

export default function BuildingDetailPageView({
  building,
}: BuildingDetailPageViewProps) {
  return (
    <MainContainer
      title={`Quản labelý tòa nhà ${building.code}`}
      links={[
        {
          href: APP_ROUTES.ADMIN.BUILDINGS.BASE,
          label: "Danh sách tòa nhà",
        },
        {
          label: `${building.code}`,
        },
      ]}
    >
      <BuildingProvider>
        <MainContentBuildingDetail building={building} />
      </BuildingProvider>
    </MainContainer>
  );
}
