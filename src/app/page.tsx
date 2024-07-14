"use client"

import { redirect, RedirectType } from "next/navigation"
import { getPreferLocale } from "@/utils/getPreferLocale"

import LinguiConfig from "../../lingui.config"

export default function RootPage() {
  const defaultLocale = LinguiConfig.fallbackLocales.default
  const locale = getPreferLocale() || defaultLocale
  redirect(`/${locale}`, RedirectType.replace)
}
