import { UtilityReadingDetail } from "@/types/utility_reading";
import { utilityReadingService } from "@/services/utility_reading.service";
import { mapErrorToMessage } from "../error/app-error";
import { Result } from "@/types/response";
import { AppError } from "../error/error-codes";

export async function createUtilityReading(
  data: Record<string, UtilityReadingDetail>,
  isFirstReading: boolean,
): Promise<Result> {
  const payload = Object.values(data);

  if (!isFirstReading) {
    payload.filter((item) => item.current_reading !== "");
  } else {
    payload.forEach((item) => {
      item.current_reading = item.previous_reading;
    });
  }

  try {
    const result = await utilityReadingService.createUtilityReading(payload);
    return {
      success: result,
    };
  } catch (error) {
    if (error instanceof AppError) {
      return {
        success: false,
        error: mapErrorToMessage(error),
      };
    }

    return { success: false, error: "Internal server error" };
  }
}
