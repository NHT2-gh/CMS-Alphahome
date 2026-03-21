export enum ErrorCode {
  DUPLICATE_DATA = "DUPLICATE_DATA",
  FOREIGN_KEY_INVALID = "FOREIGN_KEY_INVALID",
  MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",
  INVALID_INPUT = "INVALID_INPUT",
}

export class AppError extends Error {
  code: ErrorCode;

  constructor(code: ErrorCode) {
    super(code);
    this.code = code;
  }
}
