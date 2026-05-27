interface ErrorResponse {
  response?: {
    data?: {
      error?: { message?: string }
      message?: string
    }
  }
  message?: string
}

export function extractApiError(err: unknown, fallback = "An unexpected error occurred"): string {
  const errObj = err as ErrorResponse
  return (
    errObj.response?.data?.error?.message ||
    errObj.response?.data?.message ||
    errObj.message ||
    fallback
  )
}
