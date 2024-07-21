// import 'server-only'

import { I18n, Messages, setupI18n } from "@lingui/core"

import linguiConfig from "../lingui.config"

const { locales } = linguiConfig
// optionally use a stricter union type
type SupportedLocales = string

async function loadCatalog(locale: SupportedLocales): Promise<{
  [k: string]: Messages
}> {
  const { messages } = await import(`./locales/${locale}.po`)
  return {
    [locale]: messages,
  }
}
// const catalogs = await Promise.all(locales.map(loadCatalog));

// transform array of catalogs into a single object
// export const allMessages = catalogs.reduce((acc: any, oneCatalog: any) => {
//   return { ...acc, ...oneCatalog };
// }, {});

let allMessages: any

export async function getAllMessages() {
  if (allMessages) {
    return allMessages
  }
  const catalogs = await Promise.all(locales.map(loadCatalog))
  allMessages = catalogs.reduce((acc: any, oneCatalog: any) => {
    return { ...acc, ...oneCatalog }
  }, {})
  return allMessages
}

type AllI18nInstances = { [K in SupportedLocales]: I18n }

// export const allI18nInstances: AllI18nInstances = locales.reduce(
//   (acc: any, locale: any) => {
//     const messages = allMessages[locale] ?? {};
//     const i18n = setupI18n({
//       locale,
//       messages: { [locale]: messages },
//     });
//     return { ...acc, [locale]: i18n };
//   },
//   {}
// );

let allI18nInstances: AllI18nInstances

export async function getAllI18nInstances(): Promise<AllI18nInstances> {
  if (allI18nInstances) {
    return allI18nInstances
  }
  const allMessages = await getAllMessages()
  allI18nInstances = locales.reduce((acc: any, locale: any) => {
    const messages = allMessages[locale] ?? {}
    const i18n = setupI18n({
      locale,
      messages: { [locale]: messages },
    })
    return { ...acc, [locale]: i18n }
  }, {})
  return allI18nInstances
}
