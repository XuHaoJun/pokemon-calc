"use client"

import NextLink from "next/link"
import { FaGithub } from "react-icons/fa6"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

import { LangSwitch } from "./LangSwitcher"
import { MainNav } from "./MainNav"
import { MobileNav } from "./MobileNav"
import { ThemeModeSwitch } from "./ThemeModeSwitch"
import { buttonVariants } from "./ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none"></div>
          <nav className="flex items-center gap-x-2 md:gap-x-3">
            <NextLink
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "h-8 w-8 px-0"
                )}
              >
                <FaGithub className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </div>
            </NextLink>
            <ThemeModeSwitch />
            <LangSwitch />
          </nav>
        </div>
      </div>
    </header>
  )
}
