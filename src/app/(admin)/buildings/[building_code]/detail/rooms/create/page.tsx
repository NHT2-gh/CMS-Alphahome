import React from "react";
import { CreateRoomPageView } from "@/sections/rooms/view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tạo mới phòng | AlphaHome",
  description: "Tạo mới phòng AlphaHome",
};

export default async function CreateRoomPage({
  params,
}: {
  params: Promise<{ building_code: string }>;
}) {
  const { building_code } = await params;

  return <CreateRoomPageView buildingCode={building_code} />;
}
