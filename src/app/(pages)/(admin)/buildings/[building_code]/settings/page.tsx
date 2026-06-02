import { BuildingSettingView } from "@/sections/building-setting/view";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cài đặt tòa nhà | AlphaHome",
  description: "Cài đặt tòa nhà AlphaHome",
};

export default async function BuildingSettingPage() {
  return <BuildingSettingView />;
}
