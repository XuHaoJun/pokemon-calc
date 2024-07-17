"use client"

import * as React from "react"
import type { PropsWithChildren } from "react"
import {
  QueryClient,
  QueryClientProvider as QueryClientProviderOri,
} from "@tanstack/react-query"

export function QueryClientProvider(props: PropsWithChildren<{}>) {
  const [queryClient] = React.useState(() => new QueryClient())
  return (
    <QueryClientProviderOri client={queryClient}>
      {props.children}
    </QueryClientProviderOri>
  )
}
