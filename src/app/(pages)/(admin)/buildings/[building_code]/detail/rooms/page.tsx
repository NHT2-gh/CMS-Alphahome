import RoomsPageViews from "@/sections/rooms/view/rooms-page-view";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Quản lý phòng | AlphaHome",
  description: "Quản lý phòng AlphaHome",
};

export default function BuildingRoomsPage() {
  return <RoomsPageViews />;
}
