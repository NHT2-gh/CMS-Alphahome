import React from "react";
import { MainContainer } from "@/components/_cms/common";
import { APP_ROUTES } from "@/config/app-routes";
import { BuildingProvider } from "@/context/BuildingContext";
import MainLayoutBuildingDetail from "@/layout/building-detail/main-layout-building-detail";
import { buildingService } from "@/services/building.service";

export default async function BuildingDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ building_code: string }>;
}) {
  const { building_code } = await params;
  const currentBuilding = await buildingService.getBuilding(building_code);
  if (!currentBuilding) return null;
  return (
    <BuildingProvider initialBuilding={currentBuilding}>
      <MainContainer
        title={`Thông tin nhà trọ ${currentBuilding.code}`}
        links={[
          { label: "Danh sách nhà trọ", href: APP_ROUTES.ADMIN.BUILDINGS.BASE },
          { label: currentBuilding.code },
        ]}
      >
        <MainLayoutBuildingDetail>{children}</MainLayoutBuildingDetail>
      </MainContainer>
    </BuildingProvider>
  );
}
