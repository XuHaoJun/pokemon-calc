import * as React from "react"
import { useFetchPokemonData } from "@/api/query"
import { getLocaleByPokeApiLangId } from "@/utils/getLocaleByPokeApiLangId"
import { msg } from "@lingui/macro"
import { useLingui } from "@lingui/react"

export type PokemonLinguiType = "name"

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
      loaded = true
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
        const defaultForm = (() => {
          const foundDefault = x.pokemon_v2_pokemonforms.find(
            (x) => x.is_default
          )
          return foundDefault || x.pokemon_v2_pokemonforms[0]
        })()
        if (defaultForm.is_mega) {
          defaultFormNameI18nMessages[i18nId] =
            defaultForm.form_name === "mega-x"
              ? i18n._(msg`mega-x`)
              : defaultForm.form_name === "mega-y"
                ? i18n._(msg`mega-y`)
                : i18n._(msg`mega`)
        } else if (defaultForm.form_name === "gmax") {
          defaultFormNameI18nMessages[i18nId] = i18n._(msg`gmax`)
        } else {
          for (const xx of defaultForm.pokemon_v2_pokemonformnames) {
            if (getLocaleByPokeApiLangId(xx.language_id) === i18n.locale) {
              defaultFormNameI18nMessages[i18nId] = xx.name
            }
          }
        }
      }
      i18n.load(i18n.locale, defaultFormNameI18nMessages)
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
  }, [query.data, lingui.i18n, lingui.i18n.locale, targets, enabled, enableForceRender, updateOnce, lingui])
  return {
    updateOnce,
  }
}
