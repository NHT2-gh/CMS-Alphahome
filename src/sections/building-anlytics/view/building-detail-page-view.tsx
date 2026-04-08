import React from "react";
import { AnalyticsBarChart, AnalyticsMetrics } from "../components";

export default function BuildingDetailPageView() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <AnalyticsMetrics />
      </div>
      <div className="col-span-12">
        <AnalyticsBarChart />
      </div>
    </div>
  );
}
