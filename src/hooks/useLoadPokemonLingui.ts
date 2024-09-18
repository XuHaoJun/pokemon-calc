import * as React from "react"
import { useFetchPokemonData } from "@/api/query"
import { getLocaleByPokeApiLangId } from "@/utils/getLocaleByPokeApiLangId"
import { getPokemonDefaultFormName } from "@/utils/getPokemonDefaultFormName"
import { useLingui } from "@lingui/react"
import { atom, useAtom } from "jotai"

export type PokemonLinguiType = "name" | "ability" | "move"

export interface UsePokemonLinguiParams {
  targets: PokemonLinguiType[]
  enabled?: boolean
  enableForceRender?: boolean
}

export const isPkmLinguiLoadedAtom = atom<boolean>(false)

export function useLoadPokemonLingui(params: UsePokemonLinguiParams) {
  const { targets, enabled = true, enableForceRender = false } = params

  const [isPkmLinguiLoaded, setIsPkmLinguiLoaded] = useAtom(
    isPkmLinguiLoadedAtom
  )

  const query = useFetchPokemonData()
  const lingui = useLingui()
  React.useEffect(() => {
    setIsPkmLinguiLoaded(false)
  }, [lingui.i18n.locale, setIsPkmLinguiLoaded])
  React.useEffect(() => {
    if (enabled === false) {
      return
    }
    if (
      targets.includes("name") &&
      query.data &&
      Boolean(lingui.i18n.messages["pkm.name.1"]) === false
    ) {
      const nameI18nMessages: any = {}
      for (const x of query.data.data.pokemon_v2_pokemon) {
        for (const xx of x.pokemon_v2_pokemonspecy
          .pokemon_v2_pokemonspeciesnames) {
          // TODO
          // add other languages?
          if (getLocaleByPokeApiLangId(xx.language_id) === lingui.i18n.locale) {
            nameI18nMessages[`pkm.name.${x.id}`] = xx.name
          }
        }
      }
      lingui.i18n.load(lingui.i18n.locale, nameI18nMessages)
    }

    const { i18n } = lingui
    if (
      targets.includes("name") &&
      query.data &&
      Boolean(lingui.i18n.messages["pkm.defaultFormName.10079"]) === false
    ) {
      const defaultFormNameI18nMessages: any = {}
      for (const x of query.data.data.pokemon_v2_pokemon) {
        const i18nId = `pkm.defaultFormName.${x.id}`
        const defaultFormName = getPokemonDefaultFormName(x, i18n)
        defaultFormNameI18nMessages[i18nId] = defaultFormName
      }
      i18n.load(i18n.locale, defaultFormNameI18nMessages)
    }

    if (
      targets.includes("ability") &&
      query.data &&
      Boolean(i18n.messages["pkm.ability.1"]) === false
    ) {
      const ablitiesI18nMessages: any = {}
      for (const x of query.data.data.pokemon_v2_ability) {
        const i18nId = `pkm.ability.${x.id}`
        for (const xx of x.pokemon_v2_abilitynames) {
          if (getLocaleByPokeApiLangId(xx.language_id) === i18n.locale) {
            ablitiesI18nMessages[i18nId] = xx.name
          }
        }
        const i18nId2 = `pkm.abilityFlavorText.${x.id}`
        for (const xx of x.pokemon_v2_abilityflavortexts) {
          if (getLocaleByPokeApiLangId(xx.language_id) === i18n.locale) {
            ablitiesI18nMessages[i18nId2] = xx.flavor_text
          }
        }
      }
      i18n.load(i18n.locale, ablitiesI18nMessages)
    }

    if (
      targets.includes("move") &&
      query.data &&
      Boolean(i18n.messages["pkm.move.1"]) === false
    ) {
      const moveI18nMessages: any = {}
      for (const x of query.data.data.pokemon_v2_move) {
        const i18nId = `pkm.move.${x.id}`
        for (const xx of x.pokemon_v2_movenames) {
          if (
            getLocaleByPokeApiLangId(xx.language_id as number) === i18n.locale
          ) {
            moveI18nMessages[i18nId] = xx.name
          }
        }
        const i18nId2 = `pkm.moveFlavorTexts.${x.id}`
        for (const xx of x.pokemon_v2_moveflavortexts) {
          if (
            getLocaleByPokeApiLangId(xx.language_id as number) === i18n.locale
          ) {
            moveI18nMessages[i18nId2] = xx.flavor_text
          }
        }
      }
      i18n.load(i18n.locale, moveI18nMessages)
    }

    if (isPkmLinguiLoaded === false) {
      setIsPkmLinguiLoaded(true)
    }
  }, [
    query.data,
    lingui.i18n,
    lingui.i18n.locale,
    targets,
    enabled,
    enableForceRender,
    isPkmLinguiLoaded,
    lingui,
    setIsPkmLinguiLoaded,
  ])
  return {
    isPkmLinguiLoaded,
  }
}
