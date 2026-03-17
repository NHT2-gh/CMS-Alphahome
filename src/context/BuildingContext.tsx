"use client";
import { Building } from "@/types/building";
import React, { createContext, useContext, useState } from "react";

interface BuildingContextType {
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
}: {
  children: React.ReactNode;
}) => {
  const [building, setBuilding] = useState<Building | null>(null);
  return (
    <BuildingContext.Provider value={{ building, setBuilding }}>
      {children}
    </BuildingContext.Provider>
  );
};
