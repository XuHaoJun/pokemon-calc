import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"

import "../globals.css"

import { t } from "@lingui/macro"

import { cn } from "@/lib/utils"
import { StandardSiteLayout } from "@/components/layouts/StandardSiteLayout"
import { LinguiClientProvider } from "@/components/LinguiClientProvider"

import linguiConfig from "../../../lingui.config"
import { getAllI18nInstances, getAllMessages } from "../../appRouterI18n"
import { PageLangParam, withLinguiLayout } from "../../withLingui"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang: any) => ({ lang }))
}

export async function generateMetadata({ params }: PageLangParam) {
  const allI18nInstances = await getAllI18nInstances()
  const i18n = allI18nInstances[params.lang]!

  return {
    title: t(i18n)`Pokemon Calc`,
  }
}

export default withLinguiLayout(async function RootLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode
  params: any
}>) {
  const allMessages = await getAllMessages()
  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <LinguiClientProvider
          initialLocale={lang}
          initialMessages={allMessages[lang]!}
        >
          <StandardSiteLayout>{children}</StandardSiteLayout>
        </LinguiClientProvider>
      </body>
    </html>
  )
})
