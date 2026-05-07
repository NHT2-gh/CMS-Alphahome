"use client";
import React, { useEffect } from "react";
import { useBuilding } from "@/context/BuildingContext";
import { useBuildingDashboard } from "@/hooks/dashboard/use-dashboard";
import { AnalyticsBarChart, AnalyticsMetrics } from "../components";

export default function BuildingDetailPageView() {
  const { building } = useBuilding();
  const { data: dashboardBuilding } = useBuildingDashboard(building?.id);

  useEffect(() => {
    if (!building) {
      return;
    }
  }, [building]);
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {dashboardBuilding && dashboardBuilding.data ? (
        <>
          <div className="col-span-12">
            <AnalyticsMetrics
              total_profit={dashboardBuilding.data.total_profit}
              occupancy={dashboardBuilding.data.occupancy}
              current_month={dashboardBuilding.data.current_month}
            />
          </div>
          <div className="col-span-12">
            <AnalyticsBarChart
              data_current_year={
                dashboardBuilding.data.profit_12_months_current_year
              }
            />
          </div>
        </>
      ) : (
        <div className="col-span-12">Không có dữ liệu</div>
      )}
    </div>
  );
}
