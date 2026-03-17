import AnalyticsBarChart from "@/components/analytics/AnalyticsBarChart";
import AnalyticsMetrics from "@/components/analytics/AnalyticsMetrics";
import React from "react";

export default function AnalyticsBuilding() {
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
