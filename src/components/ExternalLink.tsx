import NextLink from "next/link"
import { ExternalLinkIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { badgeVariants } from "./ui/badge"

export function ExternalLink({
  href,
  children,
}: React.PropsWithChildren<{ href: string }>) {
  return (
    <NextLink
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(badgeVariants({ variant: "secondary" }), "gap-1")}
    >
      {children}
      <ExternalLinkIcon className="h-3 w-3" />
    </NextLink>
  )
}
