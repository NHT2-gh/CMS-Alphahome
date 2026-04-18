import { BuildingProvider } from "@/context/BuildingContext";
import { buildingService } from "@/services/building.service";
import React from "react";

export default async function BuildingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ building_code: string }>;
}) {
  const { building_code } = await params;
  const currentBuilding = await buildingService.getBuilding(building_code);
  if (!currentBuilding) return null;
  return (
    <BuildingProvider
      initialBuilding={{
        ...currentBuilding,
      }}
    >
      {children}
    </BuildingProvider>
  );
}
