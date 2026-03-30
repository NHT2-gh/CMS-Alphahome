import { MainContainer } from "@/components/_cms/common";
import { useBuilding } from "@/context/BuildingContext";
import { RoomOverview } from "@/types/room";
import React from "react";

interface RoomDetailPageViewProps {
  currentRoom: RoomOverview;
}

export default function RoomDetailPageView({
  currentRoom,
}: RoomDetailPageViewProps) {
  return (
    <MainContainer title={`Thông tin phòng ${currentRoom.code}`}>
      <section></section>
    </MainContainer>
  );
}
