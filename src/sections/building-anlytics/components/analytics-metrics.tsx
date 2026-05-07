import { MetricsItem } from "@/components/_cms/components/analytics-metrics";
import { BuildingDashboard } from "@/types/dashboard";
import { formatCurrency } from "@/utils/format-data";
import React from "react";

export default function AnalyticsMetrics({
  total_profit,
  current_month,
  occupancy,
}: Omit<BuildingDashboard, "profit_12_months_current_year">) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
      <MetricsItem
        id={"total_profit"}
        title={"Tổng lợi nhuận"}
        value={formatCurrency(total_profit.value)}
      />

      <MetricsItem
        id={"revenue_current_month"}
        title={"Doanh thu"}
        value={formatCurrency(current_month.revenue.value)}
        change={current_month.revenue.growth}
        comparisonText="So với tháng trước"
      />
      <MetricsItem
        id={"expense_current_month"}
        title={"Chi phí"}
        value={formatCurrency(current_month.expense.value)}
        change={current_month.expense.growth}
        comparisonText="So với tháng trước"
      />
      <MetricsItem
        id={"occupancy_current"}
        title={"Tỷ lệ lấp đầy"}
        value={`${occupancy.current.toFixed(0)}%`}
        change={occupancy.growth}
        comparisonText="So với tháng trước"
      />
    </div>
  );
}
