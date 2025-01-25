import { showToast } from "@/utils/toast";
import { AxiosError } from "axios";

export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "ApiError";
  }
}

export const handleApiError = (
  error: unknown,
  defaultMessage: string,
  onToast: boolean = false
): never => {
  let errorMessage = defaultMessage;
  let statusCode: number | undefined;

  if (error instanceof AxiosError) {
    console.log("API Error:", error.response?.data || error.message);
    statusCode = error.response?.status;

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
  } else if (error instanceof Error) {
    console.error("Unexpected Error:", error);
    errorMessage = error.message || defaultMessage;
  } else {
    console.error("Unknown Error:", error);
  }
  if (onToast) {
    showToast("error", errorMessage);
  }
  throw new ApiError(errorMessage, statusCode);
};
