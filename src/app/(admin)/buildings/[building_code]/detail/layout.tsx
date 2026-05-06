import React from "react";
import { APP_ROUTES } from "@/config/app-routes";
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

  return (
    <MainContainer
      title={`Thông tin nhà trọ ${building_code}`}
      links={[
        {
          label: "Danh sách nhà trọ",
          href: APP_ROUTES.ADMIN.BUILDINGS.BASE(),
        },
        { label: building_code },
      ]}
    >
      <MainLayoutBuildingDetail>{children}</MainLayoutBuildingDetail>
    </MainContainer>
  );
}
