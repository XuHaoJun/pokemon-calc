"use client"

import { Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { usePathname } from "@/hooks/usePathname"
import { Icons } from "@/components/icons"
import { Link } from "@/components/Link"

export function MainNav() {
  const pathname = usePathname()
  const { i18n } = useLingui()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold lg:inline-block">
          {i18n._(siteConfig.name)}
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        <Link
          href="/type-calc"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/type-calc" ? "text-foreground" : "text-foreground/50"
          )}
        >
          <Trans>Type Calculator</Trans>
        </Link>
        <Link
          href="/pokedex"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname.startsWith("/pokedex")
              ? "text-foreground"
              : "text-foreground/50"
          )}
        >
          <Trans>Pokédex</Trans>
        </Link>
        <Link
          href="/whos-that-pokemon"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname.startsWith("/whos-that-pokemon")
              ? "text-foreground"
              : "text-foreground/50"
          )}
        >
          <Trans>Who&apos;s That Pokémon?</Trans>
        </Link>
      </nav>
    </div>
  )
}
