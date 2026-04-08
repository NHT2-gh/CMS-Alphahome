import { ErrorCode } from "./error-codes";

const errorMessageMap: Record<ErrorCode, string> = {
  [ErrorCode.DUPLICATE_DATA]: "Dữ liệu đã tồn tại",
  [ErrorCode.FOREIGN_KEY_INVALID]: "Dữ liệu liên kết không hợp lệ",
  [ErrorCode.MISSING_REQUIRED_FIELD]: "Vui lòng nhập đầy đủ thông tin",
  [ErrorCode.INVALID_INPUT]: "Dữ liệu không hợp lệ",
  [ErrorCode.NOT_FOUND]: "Không tìm thấy dữ liệu",
};

export const mapErrorToMessage = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return "Đã xảy ra lỗi không xác định";
  }

  const code = error.message as ErrorCode;

  return errorMessageMap[code] ?? "Đã có lỗi xảy ra, vui lòng thử lại";
};
