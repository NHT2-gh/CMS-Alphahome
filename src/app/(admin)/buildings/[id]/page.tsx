import React from "react";
import { buildingService } from "@/services/building.service";
import { BuildingDetailPageView } from "@/sections/building-detail";

export default async function BuildingDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const currentBuilding = await buildingService.getBuildingById(id);

  if (!currentBuilding) return null;

  return <BuildingDetailPageView building={currentBuilding} />;
}
