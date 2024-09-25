export function formatResponseError(error: any) {
  if (error?.status >= 400 && error?.status < 500) {
    if (error.response) {
      return error.response.data?.error || error.response.data?.message
    } else {
      return "unknown error"
    }
  }
  return error?.message || "unknown error"
}
