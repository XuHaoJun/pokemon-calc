import dynamic from "next/dynamic"

import { LoadingSpinner } from "./ui/loading-spinner"

export const JsonEditor = dynamic(
  async () => {
    const { JsonEditor } = await import("json-edit-react")
    return JsonEditor
  },
  {
    loading: () => <LoadingSpinner />,
  }
)
