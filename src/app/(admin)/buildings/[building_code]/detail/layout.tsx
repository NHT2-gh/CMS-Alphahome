import React from "react";
import { APP_ROUTES } from "@/config/app-routes";
import { buildingService } from "@/services/building.service";
import { MainContainer } from "@/components/_cms/common/page-layout";
import MainLayoutBuildingDetail from "@/layout/building-detail/main-layout-building-detail";

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
    <MainContainer
      title={`Thông tin nhà trọ ${currentBuilding.code}`}
      links={[
        {
          label: "Danh sách nhà trọ",
          href: APP_ROUTES.ADMIN.BUILDINGS.BASE(),
        },
        { label: currentBuilding.code },
      ]}
    >
      <MainLayoutBuildingDetail>{children}</MainLayoutBuildingDetail>
    </MainContainer>
  );
}
