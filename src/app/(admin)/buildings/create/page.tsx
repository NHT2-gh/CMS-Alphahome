import { BuildingCreatePageView } from "@/sections/building-create/view";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tạo mới tòa nhà | AlphaHome",
  description: "Tạo mới tòa nhà AlphaHome",
};

export default function CreateBuildingPage() {
  return <BuildingCreatePageView />;
}
