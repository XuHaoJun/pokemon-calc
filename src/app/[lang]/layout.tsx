import { Inter as FontSans } from "next/font/google"
import { t } from "@lingui/macro"

import "../globals.css"

import { AxiosProvider } from "@/providers/AxiosProvider"
import { FlexsearchProvider } from "@/providers/FlexsearchProvider"
import { QueryClientProvider } from "@/providers/QueryClientProvider"
import { ThemeProvider } from "@/providers/ThemeProvider"

import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
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

export default withLinguiLayout(async function RootLayout(
  props: Readonly<{
    children: React.ReactNode
    params: any
    Component: any
  }>
) {
  const {
    children,
    params: { lang },
  } = props
  const allMessages = await getAllMessages()
  return (
    <html lang={lang} dir="ltr" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <AxiosProvider apiBase={process.env.API_BASE} />
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
              <TooltipProvider>
                <FlexsearchProvider>
                  <StandardSiteLayout>{children}</StandardSiteLayout>
                </FlexsearchProvider>
              </TooltipProvider>
            </ThemeProvider>
          </LinguiClientProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
})
