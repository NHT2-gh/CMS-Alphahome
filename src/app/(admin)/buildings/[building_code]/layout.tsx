import React from "react";
import { notFound } from "next/navigation";
import { AppError } from "@/lib/error/error-codes";
import { BuildingProvider } from "@/context/BuildingContext";
import { buildingService } from "@/services/building.service";

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
    if (error instanceof AppError && error.code === "NOT_FOUND") {
      return notFound();
    }
    notFound();
  }
}
