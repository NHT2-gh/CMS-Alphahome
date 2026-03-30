import React from "react";
import { buildingService } from "@/services/building.service";
import { BuildingDetailPageView } from "@/sections/building-detail";
import { useBuilding } from "@/context/BuildingContext";

export default async function BuildingDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <BuildingDetailPageView />;
}
