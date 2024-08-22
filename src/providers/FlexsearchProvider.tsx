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
import { getPokemonDefaultFormName } from "@/utils/getPokemonDefaultFormName"
import { useLingui } from "@lingui/react"
import { useAtomValue, useSetAtom } from "jotai"
import { ScopeProvider } from "jotai-scope"

export function FlexsearchProvider(props: { children: React.ReactNode }) {
  return (
    <ScopeProvider atoms={flexsearchAtoms}>
      <FlexsearchInitEffect>{props.children}</FlexsearchInitEffect>
    </ScopeProvider>
  )
}

export function FlexsearchInitEffect(props: { children: React.ReactNode }) {
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
      if (flexsearchLib.state !== "hasData" || !query.data) {
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

      setFlexsearchIsIndexing(true)
      const ps = []
      for (const x of query.data.data.pokemon_v2_pokemon) {
        const names: Record<string, string> = {}
        for (const nameInfo of x.pokemon_v2_pokemonspecy
          .pokemon_v2_pokemonspeciesnames) {
          const locale = getLocaleByPokeApiLangId(nameInfo.language_id, null)
          if (locale && locale === lingui.i18n.locale) {
            const defaultFormName = getPokemonDefaultFormName(x, lingui.i18n)
            const getFinalName = () => {
              if (defaultFormName) {
                return `${nameInfo.name} ${defaultFormName}`
              } else {
                return nameInfo.name
              }
            }
            names[locale] = getFinalName()
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
    initSearchIndex()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, lingui.i18n.locale, flexsearchLib.state])
}
