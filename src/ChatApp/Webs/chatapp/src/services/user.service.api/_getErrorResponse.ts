import { AxiosError, isAxiosError } from "axios";

type ApiErrorResponse = {
  details: string
  message: string
  time: string
}

export function getErrorResponse(error: Error | AxiosError<ApiErrorResponse>): { message: string } {
  if (isAxiosError(error)) {
    const { message } = error.response?.data
    return { message }
  }

  return {
    message: error.message
  }
}