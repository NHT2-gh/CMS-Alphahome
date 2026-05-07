import { MainContainer } from "@/components/_cms/common/page-layout";
import { APP_ROUTES } from "@/config/app-routes";
import React from "react";
import { BuildingCreateForm } from "../components";

export default function BuildingCreatePageView() {
  return (
    <MainContainer
      title="Thêm toà nhà"
      links={[
        { label: "Danh sách toà nhà", href: APP_ROUTES.ADMIN.BUILDINGS.BASE() },
        { label: "Thêm toà nhà" },
      ]}
    >
      <BuildingCreateForm />
    </MainContainer>
  );
}
