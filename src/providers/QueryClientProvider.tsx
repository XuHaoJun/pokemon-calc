"use client"

import * as React from "react"
import type { PropsWithChildren } from "react"
import {
  QueryClient,
  QueryClientProvider as QueryClientProviderOri,
} from "@tanstack/react-query"

let queryClientInClientSide: QueryClient

function getQueryClient() {
  if (typeof window !== "undefined") {
    if (!queryClientInClientSide) {
      queryClientInClientSide = new QueryClient()
    }
    return queryClientInClientSide
  }
  return new QueryClient()
}

export function QueryClientProvider(props: PropsWithChildren<{}>) {
  const [queryClient] = React.useState(() => getQueryClient())
  return (
    <QueryClientProviderOri client={queryClient}>
      {props.children}
    </QueryClientProviderOri>
  )
}
