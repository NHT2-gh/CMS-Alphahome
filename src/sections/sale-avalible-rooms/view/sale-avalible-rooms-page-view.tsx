import { MainContainer } from "@/components/_cms/common/page-layout";
import { APP_ROUTES } from "@/config/app-routes";
import React from "react";
import { AvalibleRoomsTableList } from "../components";

export default function SaleAvalibleRoomsPageView() {
  return (
    <MainContainer
      title={"Danh sách phòng trống"}
      links={[
        {
          href: APP_ROUTES.SALE.BASE,
          label: "Quản lý sale phòng",
        },
        { label: "Danh sách phòng" },
      ]}
    >
      <AvalibleRoomsTableList />
    </MainContainer>
  );
}
