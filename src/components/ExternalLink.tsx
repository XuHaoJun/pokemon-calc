import * as React from "react"
import NextLink from "next/link"
import { ExternalLinkIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { badgeVariants } from "./ui/badge"

export function ExternalLink({
  href,
  children,
  noreferrer = true,
}: React.PropsWithChildren<{ href: string; noreferrer?: boolean }>) {
  const rel = React.useMemo(() => {
    return noreferrer ? "noreferrer" : undefined
  }, [noreferrer])
  return (
    <NextLink
      href={href}
      target="_blank"
      rel={rel}
      className={cn(badgeVariants({ variant: "secondary" }), "gap-1")}
    >
      {children}
      <ExternalLinkIcon className="h-3 w-3" />
    </NextLink>
  )
}
