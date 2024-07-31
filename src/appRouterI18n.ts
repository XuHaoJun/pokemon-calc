import "server-only"

import { I18n, Messages, setupI18n } from "@lingui/core"

import linguiConfig from "../lingui.config"
import { fetchPokemonDataWithOptions } from "./api"
import { getLocaleByPokeApiLangId } from "./utils/getLocaleByPokeApiLangId"

const { locales } = linguiConfig
// optionally use a stricter union type
type SupportedLocales = string

async function loadCatalog(locale: SupportedLocales): Promise<{
  [k: string]: Messages
}> {
  const { messages } = await import(`./locales/${locale}.po`)
  const pokemonData = await fetchPokemonDataWithOptions({ ssg: true })
  const pkmMessages: Record<string, string> = {}
  for (const x of pokemonData.data.pokemon_v2_type) {
    const typeName = x.pokemon_v2_typenames.find(
      (t) => getLocaleByPokeApiLangId(t.language_id, null) === locale
    )
    if (typeName) {
      pkmMessages[`pkm.type.${x.name}`] = typeName.name
    }
  }

  const finalMessages = {
    ...messages,
    ...pkmMessages,
  }
  return {
    [locale]: finalMessages,
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

export async function getAllI18nInstances(): Promise<AllI18nInstances> {
  const allMessages = await getAllMessages()
  return locales.reduce((acc: any, locale: any) => {
    const messages = allMessages[locale] ?? {}
    const i18n = setupI18n({
      locale,
      messages: { [locale]: { ...messages } },
    })
    return { ...acc, [locale]: i18n }
  }, {})
}
