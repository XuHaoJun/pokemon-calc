"use client"

// this is a client component because it uses the `useState` hook
import React, { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { msg } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { FaLanguage } from "react-icons/fa6"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

import { Button, buttonVariants } from "./ui/button"

type LOCALES = "en" | "sr" | "es" | "pseudo"

const languages = {
  en: msg`English`,
  "zh-Hant": msg`繁體中文`,
  "zh-Hans": msg`简体中文`,
} as const

export function LangSwitcher() {
  const router = useRouter()
  const { i18n } = useLingui()
  const pathname = usePathname()

  const [locale, setLocale] = useState<LOCALES>(
    pathname?.split("/")[1] as LOCALES
  )

  // disabled for DEMO - so we can demonstrate the 'pseudo' locale functionality
  // if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production') {
  //   languages['pseudo'] = t`Pseudo`
  // }

  function handleChange(_locale: string) {
    const locale = _locale as LOCALES

    const pathNameWithoutLocale = pathname?.split("/")?.slice(2) ?? []
    const newPath = `/${locale}/${pathNameWithoutLocale.join("/")}`

    setLocale(locale)
    router.push(newPath)
  }

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger className={cn("h-8")}>
        <div
          className={cn(
            buttonVariants({
              variant: "ghost",
            }),
            "h-8 w-8 px-0"
          )}
        >
          <FaLanguage className="h-6 w-6" />
          <span className="sr-only">Languages Switch</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.keys(languages).map((locale) => {
          return (
            <SelectItem value={locale} key={locale}>
              {i18n._(languages[locale as keyof typeof languages])}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
