// src/lib/errors/postgres-error.ts

import { AuthError, PostgrestError } from "@supabase/supabase-js";
import { AppError, ErrorCode } from "./error-codes";

export const handlePostgresError = (
  error: PostgrestError | AuthError,
): never => {
  switch (error.code) {
    case "23505":
      throw new AppError(ErrorCode.DUPLICATE_DATA);

    case "23503":
      throw new AppError(ErrorCode.FOREIGN_KEY_INVALID);

    case "23502":
      throw new AppError(ErrorCode.MISSING_REQUIRED_FIELD);
    case "PGRST116":
      throw new AppError(ErrorCode.NOT_FOUND);

    default:
      throw new AppError(ErrorCode.INVALID_INPUT);
  }
};
