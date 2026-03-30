"use client";
import { Building } from "@/types/building";
import React, { createContext, useContext, useState } from "react";

interface BuildingContextType {
  initialBuilding: Building;
  building: Building | null;
  setBuilding: (building: Building) => void;
}
export const BuildingContext = createContext<BuildingContextType | null>(null);

export const useBuilding = () => {
  const context = useContext(BuildingContext);
  if (!context) throw new Error("useBuilding must be used within provider");
  return context;
};

export const BuildingProvider = ({
  children,
  initialBuilding,
}: {
  children: React.ReactNode;
  initialBuilding: Building;
}) => {
  const [building, setBuilding] = useState<Building | null>(initialBuilding);
  return (
    <BuildingContext.Provider
      value={{ building, setBuilding, initialBuilding }}
    >
      {children}
    </BuildingContext.Provider>
  );
};
