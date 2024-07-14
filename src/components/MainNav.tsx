"use client"

import { Trans } from "@lingui/macro"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { usePathname } from "@/hooks/usePathname"
import { Icons } from "@/components/icons"
import { Link } from "@/components/Link"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold lg:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        <Link
          href="/type"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/type" ? "text-foreground" : "text-foreground/60"
          )}
        >
          <Trans>Type Calculator</Trans>
        </Link>
        <Link
          href="/pokemon"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname.startsWith("/pokemon")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          <Trans>Pokédex</Trans>
        </Link>
      </nav>
    </div>
  )
}
