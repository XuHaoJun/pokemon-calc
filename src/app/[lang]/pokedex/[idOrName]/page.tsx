import { fetchPokemonDataWithOptions } from "@/api"
import { getAllI18nInstances } from "@/appRouterI18n"
import { getLocaleByPokeApiLangId } from "@/utils/getLocaleByPokeApiLangId"
import { setI18n } from "@lingui/react/server"

import { PokemonDetailPage } from "./PokemonDetailPage"

export async function generateStaticParams(props: {
  params: { lang: string }
}) {
  const pokemonData = await fetchPokemonDataWithOptions({ ssg: true })
  // TODO
  // find name from pkm.pokemon_v2_pokemonspecy.pokemon_v2_pokemonspeciesnames
  // by props.params.lang
  return pokemonData.data.pokemon_v2_pokemon.map((pkm) => ({
    idOrName: `${pkm.id}`,
  }))
}

export default async function PokemonDetailPageServer(props: any) {
  const pokemonData = await fetchPokemonDataWithOptions({ ssg: true })
  const pokemon = pokemonData.data.pokemon_v2_pokemon.find(
    (pkm) => pkm.id === props.params.idOrName
  )

  const lang = props.params.lang
  const allI18nInstances = await getAllI18nInstances()
  const i18n = allI18nInstances[lang]!

  const nameI18nMessages: any = {}
  for (const x of pokemonData.data.pokemon_v2_pokemon) {
    for (const xx of x.pokemon_v2_pokemonspecy.pokemon_v2_pokemonspeciesnames) {
      // TODO
      // add other languages?
      if (
        getLocaleByPokeApiLangId(xx.language_id) === i18n.locale &&
        x.id.toString() === props.params.idOrName
      ) {
        nameI18nMessages[`pkm.name.${x.id}`] = xx.name
      }
    }
  }
  i18n.load(i18n.locale, nameI18nMessages)
  const typeI18nMessages: any = {}
  for (const x of pokemonData.data.pokemon_v2_type) {
    for (const xx of x.pokemon_v2_typenames) {
      // TODO
      // add other languages?
      if (getLocaleByPokeApiLangId(xx.language_id) === i18n.locale) {
        typeI18nMessages[`pkm.type.${x.name}`] = xx.name
      }
    }
  }
  i18n.load(i18n.locale, typeI18nMessages)
  setI18n(i18n)

  return <PokemonDetailPage pokemon={pokemon} id={props.params.idOrName} />
}
