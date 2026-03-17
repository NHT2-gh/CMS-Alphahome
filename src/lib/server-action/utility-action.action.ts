import { UtilityReadingDetail } from "@/types/utility_reading";
import { utilityReadingService } from "@/services/utility_reading.service";

export async function createUtilityReading(
  data: Record<string, UtilityReadingDetail>,
  isFirstReading: boolean,
) {
  const payload = Object.values(data);

  console.log(payload);

  if (!isFirstReading) {
    payload.filter((item) => item.current_reading !== "");
  } else {
    payload.forEach((item) => {
      item.current_reading = item.previous_reading;
    });
  }
  await utilityReadingService.createUtilityReading(payload);
}
