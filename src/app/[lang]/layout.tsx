import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";

import linguiConfig from "../../../lingui.config";
import { getAllI18nInstances, getAllMessages } from "../../appRouterI18n";
import { LinguiClientProvider } from "@/components/LinguiClientProvider";
import { PageLangParam, withLinguiLayout } from "../../withLingui";
import { t } from "@lingui/macro";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang: any) => ({ lang }));
}

export async function generateMetadata({ params }: PageLangParam) {
  const allI18nInstances = await getAllI18nInstances();
  const i18n = allI18nInstances[params.lang]!;

  return {
    title: t(i18n)`Translation Demo`,
  };
}

export default withLinguiLayout(async function RootLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: any;
}>) {
  const allMessages = await getAllMessages();
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
          {children}
        </LinguiClientProvider>
      </body>
    </html>
  );
});
