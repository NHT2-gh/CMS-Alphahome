import React from "react";
import { CreateRoomPageView } from "@/sections/rooms/view";

export default async function CreateRoomPage({
  params,
}: {
  params: Promise<{ building_code: string }>;
}) {
  const { building_code } = await params;

  return <CreateRoomPageView buildingCode={building_code} />;
}
