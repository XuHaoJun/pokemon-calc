import * as React from "react"
import { HeaderContext } from "@tanstack/react-table"
import { ArrowDown, ArrowUp } from "lucide-react"

import { Button } from "../ui/button"

export interface SimpleHeaderProps<T> {
  headerContext: HeaderContext<T, unknown>
}

export function SimpleHeader<T>({
  headerContext,
  children,
}: React.PropsWithChildren<SimpleHeaderProps<T>>) {
  const { column } = headerContext
  const isSorted = column.getIsSorted()
  const handleClick = React.useCallback(() => {
    column.toggleSorting(
      column.getIsSorted() === false ? true : column.getIsSorted() === "asc"
    )
  }, [column])
  return (
    <div className="flex flex-col gap-1 pb-2">
      <Button variant="ghost" onClick={handleClick}>
        {children}
        {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
        {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
        {isSorted === false && <div className="ml-2 h-4 w-4" />}
      </Button>
    </div>
  )
}
