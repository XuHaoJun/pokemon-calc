import * as React from "react"
import { useFetchPokemonData } from "@/api/query"
import { getLocaleByPokeApiLangId } from "@/utils/getLocaleByPokeApiLangId"
import { useLingui } from "@lingui/react"

export type PokemonLinguiType = "name" | "type"

export interface UsePokemonLinguiParams {
  targets: PokemonLinguiType[]
  enabled?: boolean
  enableForceRender?: boolean
}

export function useLoadPokemonLingui(params: UsePokemonLinguiParams) {
  const { targets, enabled = true, enableForceRender = false } = params

  const [updateOnce, setUpdateOnce] = React.useState<boolean>(false)

  const query = useFetchPokemonData()
  const lingui = useLingui()
  React.useEffect(() => {
    if (enabled === false) {
      return
    }
    let loaded = false
    if (
      targets.includes("name") &&
      query.data &&
      Boolean(lingui.i18n.messages["pkm.name.1"]) === false
    ) {
      const pkmTypeI18nMessages: any = {}
      for (const x of query.data.data.pokemon_v2_pokemon) {
        for (const xx of x.pokemon_v2_pokemonspecy
          .pokemon_v2_pokemonspeciesnames) {
          // TODO
          // add other languages?
          if (getLocaleByPokeApiLangId(xx.language_id) === lingui.i18n.locale) {
            pkmTypeI18nMessages[`pkm.name.${x.id}`] = xx.name
          }
        }
      }
      lingui.i18n.load(lingui.i18n.locale, pkmTypeI18nMessages)
      loaded = true
    }
    if (
      targets.includes("type") &&
      query.data &&
      Boolean(lingui.i18n.messages["pkm.type.normal"]) === false
    ) {
      const pkmTypeI18nMessages: any = {}
      for (const x of query.data.data.pokemon_v2_type) {
        for (const xx of x.pokemon_v2_typenames) {
          // TODO
          // add other languages?
          if (getLocaleByPokeApiLangId(xx.language_id) === lingui.i18n.locale) {
            pkmTypeI18nMessages[`pkm.type.${x.name}`] = xx.name
          }
        }
      }
      lingui.i18n.load(lingui.i18n.locale, pkmTypeI18nMessages)
      loaded = true
    }
    if (loaded) {
      setUpdateOnce(true)
    }
    // TODO
    // should watch lingui.messages[<YOUR_TARGET>] update and then trigger render
    if (updateOnce === false) {
      setUpdateOnce(true)
    }
  }, [
    query.data,
    lingui.i18n,
    lingui.i18n.locale,
    targets,
    enabled,
    enableForceRender,
    updateOnce,
  ])
}
