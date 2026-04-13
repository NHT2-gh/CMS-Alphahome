import { MainContainer } from "@/components/_cms/common";
import { Contract } from "@/types/contract";
import { Room, RoomRentHistory } from "@/types/room";
import React from "react";
import {
  ViewDetailRoomInfo,
  ViewContract,
} from "../components/view-edit-detail";

interface RoomDetailPageViewProps {
  room: Room;
  rentHistory: RoomRentHistory[];
  contract?: Contract;
}

export default function RoomDetailPageView({
  room,
  contract,
  rentHistory,
}: RoomDetailPageViewProps) {
  return (
    <MainContainer title={`Thông tin chi tiết phòng ${room.code}`}>
      <ViewDetailRoomInfo currentRoom={room} rentHistory={rentHistory} />

      <ViewContract contract={contract} />
    </MainContainer>
  );
}
