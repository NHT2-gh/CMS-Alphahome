import {
  UtilityReadingResponse,
  UtilityReadingType,
  YearData,
} from "@/types/utility_reading";

export function adaptUtilityData(
  rows: UtilityReadingResponse[],
): Map<number, YearData> {
  const result = new Map<number, YearData>();

  rows.forEach((row) => {
    const date = new Date(row.month);
    const year = date.getFullYear();
    const month =
      date.getMonth() > 9
        ? `${date.getMonth() + 1}`
        : `0${date.getMonth() + 1}`;

    if (!result.has(year)) {
      result.set(year, {
        total_rooms: row.total_rooms,
        data: [],
      });
    }

    const yearData = result.get(year)!;

    let monthData = yearData.data.find((m) => m.month === month);

    if (!monthData) {
      monthData = {
        month,
        utility_readings: [],
      };
      yearData.data.push(monthData);
    }

    monthData.utility_readings.push({
      utility_type: row.utility_type as UtilityReadingType,
      total_consumption: row.total_consumption,
    });
  });

  return result;
}
