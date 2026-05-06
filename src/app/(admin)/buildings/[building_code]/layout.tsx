import { APP_ROUTES } from "@/config/app-routes";
import { BuildingProvider } from "@/context/BuildingContext";
import { buildingService } from "@/services/building.service";
import { notFound } from "next/navigation";
import React from "react";

export default async function BuildingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ building_code: string }>;
}) {
  const { building_code } = await params;

  try {
    const currentBuilding = await buildingService.getBuilding(building_code);
    if (currentBuilding)
      return (
        <BuildingProvider
          initialBuilding={{
            ...currentBuilding,
          }}
        >
          {children}
        </BuildingProvider>
      );
  } catch (error) {
    console.log(error);
    return notFound();
  }
}
