"use client"

import * as React from "react"
import type { PropsWithChildren } from "react"
import {
  QueryClient,
  QueryClientProvider as QueryClientProviderOri,
} from "@tanstack/react-query"

const queryClient = new QueryClient()

export function QueryClientProvider(props: PropsWithChildren<{}>) {
  return (
    <QueryClientProviderOri client={queryClient}>
      {props.children}
    </QueryClientProviderOri>
  )
}
