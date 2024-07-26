"use client"

import * as React from "react"
import { useFetchPokemonData } from "@/api/query"
import {
  flexsearchAtom,
  flexsearchAtoms,
  flexsearchIsIndexingAtom,
  flexsearchLibAtom,
} from "@/atoms"
import { getLocaleByPokeApiLangId } from "@/utils/getLocaleByPokeApiLangId"
import { useLingui } from "@lingui/react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { ScopeProvider } from "jotai-scope"

export function FlexsearchProvider(props: { children: React.ReactNode }) {
  return (
    <ScopeProvider atoms={flexsearchAtoms}>
      <FlexsearchEffectProvider>{props.children}</FlexsearchEffectProvider>
    </ScopeProvider>
  )
}

export function FlexsearchEffectProvider(props: { children: React.ReactNode }) {
  useInitFlexsearch()
  return props.children
}

export function useInitFlexsearch() {
  const lingui = useLingui()

  const query = useFetchPokemonData()
  const flexsearchLib = useAtomValue(flexsearchLibAtom)
  const setFlexsearch = useSetAtom(flexsearchAtom)
  const setFlexsearchIsIndexing = useSetAtom(flexsearchIsIndexingAtom)
  React.useEffect(() => {
    async function initSearchIndex() {
      if (flexsearchLib.state !== "hasData") {
        return
      }
      const FlexSearch = flexsearchLib.data
      const flexsearchIndex = new FlexSearch.Document({
        encode: false,
        tokenize: "full",
        document: {
          id: "id",
          tag: "tag",
          index: [
            "names:en",
            "names:zh-Hant",
            "names:zh-Hans",
            "names:ja",
            "names:ko",
          ],
        },
      })

      if (query.data) {
        setFlexsearchIsIndexing(true)
        const ps = []
        for (const x of query.data.data.pokemon_v2_pokemon) {
          const names: Record<string, string> = {}
          for (const nameInfo of x.pokemon_v2_pokemonspecy
            .pokemon_v2_pokemonspeciesnames) {
            const locale = getLocaleByPokeApiLangId(nameInfo.language_id, null)
            if (locale && locale === lingui.i18n.locale) {
              names[locale] = nameInfo.name
            }
          }
          const nextDoc = { id: x.id, tag: "pokemon", names }
          const p = flexsearchIndex.addAsync(x.id, nextDoc)
          ps.push(p)
        }
        await Promise.all(ps)
        setFlexsearch({ index: flexsearchIndex })
        setFlexsearchIsIndexing(false)
      }
    }
    initSearchIndex()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, lingui.i18n.locale, flexsearchLib.state])
}
