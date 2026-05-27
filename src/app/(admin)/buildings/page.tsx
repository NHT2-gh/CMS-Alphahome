import { BuildingPageView } from "@/sections/buildings";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Quản lý tòa nhà | AlphaHome",
  description: "Quản lý tòa nhà AlphaHome",
};

export default function BuildingPage() {
  return <BuildingPageView />;
}
