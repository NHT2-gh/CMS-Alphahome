import NotFoundPage from "@/app/not-found";
import { getRoomDetailServerAction } from "@/lib/server-action/room.action";
import { RoomDetailPageView } from "@/sections/rooms/view";
import React from "react";

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ building_code: string; code: string }>;
}) {
  const { building_code, code } = await params;

  const roomDetailData = await getRoomDetailServerAction(building_code, code);

  if (!roomDetailData.room) {
    return <NotFoundPage />;
  }

  return (
    <RoomDetailPageView
      room={roomDetailData.room}
      rentHistory={roomDetailData.rentHistory}
      contract={(await roomDetailData).contract}
    />
  );
}
