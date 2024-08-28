import { Pokemon } from "@/domain/pokemon"
import { I18n } from "@lingui/core"
import { msg } from "@lingui/macro"

import { getLocaleByPokeApiLangId } from "./getLocaleByPokeApiLangId"

export function getPokemonDefaultFormName(x: Pokemon, i18n: I18n) {
  const defaultForm = (() => {
    const foundDefault = x.pokemon_v2_pokemonforms.find((x) => x.is_default)
    return foundDefault || x.pokemon_v2_pokemonforms[0]
  })()
  if (defaultForm.is_mega) {
    return defaultForm.form_name === "mega-x"
      ? i18n._(msg`mega-x`)
      : defaultForm.form_name === "mega-y"
        ? i18n._(msg`mega-y`)
        : i18n._(msg`mega`)
  } else if (defaultForm.form_name === "gmax") {
    return i18n._(msg`gmax`)
  } else {
    for (const xx of defaultForm.pokemon_v2_pokemonformnames) {
      if (getLocaleByPokeApiLangId(xx.language_id) === i18n.locale) {
        return xx.name
      }
    }
  }
}
