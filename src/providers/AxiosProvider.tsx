"use client"

import { axiosMainInstance } from "@/api"

export function AxiosProvider(props: {
  apiBase?: string
  children?: React.ReactNode
}) {
  if (props.apiBase && axiosMainInstance.defaults.baseURL !== props.apiBase) {
    axiosMainInstance.defaults.baseURL = props.apiBase
  }
  return <>{props.children}</>
}
