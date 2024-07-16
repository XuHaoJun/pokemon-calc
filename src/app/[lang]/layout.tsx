import { Inter as FontSans } from "next/font/google"
import { t } from "@lingui/macro"

import "../globals.css"

import { QueryClientProvider } from "@/providers/QueryClientProvider"
import { ThemeProvider } from "@/providers/ThemeProvider"

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
    <html lang={lang} dir="ltr" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <QueryClientProvider>
          <LinguiClientProvider
            initialLocale={lang}
            initialMessages={allMessages[lang]!}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <StandardSiteLayout>{children}</StandardSiteLayout>
            </ThemeProvider>
          </LinguiClientProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
})
