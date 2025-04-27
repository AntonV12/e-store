import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}
export function isSerializedError(error: unknown): error is { message?: string } {
  return typeof error === "object" && error != null && "message" in error;
}
