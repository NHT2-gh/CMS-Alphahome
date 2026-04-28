import { Contract } from "@/types/contract";
import { Room, RoomRentHistory } from "@/types/room";
import React from "react";
import {
  ViewDetailRoomInfo,
  ViewContract,
} from "../components/view-edit-detail";
import { MainContainer } from "@/components/_cms/common/page-layout";
import { APP_ROUTES } from "@/config/app-routes";

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
    <div className="space-y-4 md:space-y-5">
      <ViewDetailRoomInfo currentRoom={room} rentHistory={rentHistory} />

      <ViewContract contract={contract} />
    </div>
  );
}
