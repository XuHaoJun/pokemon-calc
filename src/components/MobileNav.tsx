"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { MdMenu } from "react-icons/md"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { useLocalePath } from "@/hooks/useLocalePath"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Link, LinkProps } from "@/components/Link"

import { Icons } from "./icons"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const { i18n } = useLingui()
  const pathname = usePathname()
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <MdMenu />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <MobileLink
          href="/"
          className="flex items-center"
          onOpenChange={setOpen}
        >
          <Icons.logo className="mr-2 h-4 w-4" />
          <span className="font-bold">{i18n._(siteConfig.name)}</span>
        </MobileLink>

        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            <MobileLink
              href="/type-calc"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/type-calc"
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
              onOpenChange={setOpen}
            >
              <Trans>Type Calculator</Trans>
            </MobileLink>
            <MobileLink
              href="/pokedex"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname.startsWith("/pokedex")
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
              onOpenChange={setOpen}
            >
              <Trans>Pokédex</Trans>
            </MobileLink>
          </div>
          <div className="flex flex-col space-y-2"></div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter()
  const { localePath } = useLocalePath()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(localePath(href.toString()).toString())
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}
