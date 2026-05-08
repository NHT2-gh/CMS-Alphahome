import { Contract } from "@/types/contract";
import { Room, RoomRentHistory } from "@/types/room";
import React from "react";
import {
  ViewDetailRoomInfo,
  ViewContract,
  ViewRoomServiceExtra,
} from "../components/view-edit-detail";
import { MainContainer } from "@/components/_cms/common/page-layout";
import { APP_ROUTES } from "@/config/app-routes";
import { RoomServiceExtra } from "@/types/bill";

interface RoomDetailPageViewProps {
  room: Room;
  rentHistory: RoomRentHistory[];
  contract?: Contract;
  roomServiceExtras?: RoomServiceExtra[];
}

export default function RoomDetailPageView({
  room,
  contract,
  rentHistory,
  roomServiceExtras,
}: RoomDetailPageViewProps) {
  return (
    <div className="space-y-4 md:space-y-5">
      <ViewDetailRoomInfo currentRoom={room} rentHistory={rentHistory} />
      {roomServiceExtras && (
        <ViewRoomServiceExtra
          roomId={room.id}
          roomServiceExtras={roomServiceExtras}
        />
      )}

      {contract && <ViewContract contract={contract} />}
    </div>
  );
}
