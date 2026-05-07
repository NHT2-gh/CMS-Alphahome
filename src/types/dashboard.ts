export interface CurrentMonthData {
  revenue: {
    value: number;
    growth: number;
  };
  expense: {
    value: number;
    growth: number;
  };
}

export interface Occupancy {
  current: number;
  previous: number;
  growth: number;
}

export interface ProfitMonth {
  month: string;
  revenue: number;
  expense: number;
  profit: number;
}
export interface BuildingDashboard {
  total_profit: {
    value: number;
  };
  current_month: CurrentMonthData;
  occupancy: Occupancy;
  profit_12_months_current_year: ProfitMonth[];
}
