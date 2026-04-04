import { MainContainer } from "@/components/_cms/common";
import React from "react";
import { CreateRoomForm } from "../components/create-room";
import { APP_ROUTES } from "@/config/app-routes";

interface Props {
  buildingCode: string;
}

export default function CreateRoomPageView({ buildingCode }: Props) {
  return (
    <MainContainer
      title="Form thêm phòng"
      links={[
        {
          label: "Danh sách phòng",
          href: APP_ROUTES.ADMIN.BUILDINGS.ID.ROOMS.BASE(buildingCode),
        },
        { label: "Thêm phòng" },
      ]}
    >
      <CreateRoomForm />
    </MainContainer>
  );
}
