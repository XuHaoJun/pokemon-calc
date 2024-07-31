import { fetchPokemonDataWithOptions } from "@/api"
import { getAllI18nInstances } from "@/appRouterI18n"
import { getLocaleByPokeApiLangId } from "@/utils/getLocaleByPokeApiLangId"
import { toPokemon2 } from "@/utils/toPokemon2"
import { msg, t } from "@lingui/macro"
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
    id: `${pkm.id}`,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; id: string }
}) {
  const allI18nInstances = await getAllI18nInstances()
  const i18n = allI18nInstances[params.lang]!
  const pokemonData = await fetchPokemonDataWithOptions({ ssg: true })
  const pkm = pokemonData.data.pokemon_v2_pokemon.find(
    (x) => x.id === Number(params.id)
  )
  const pkmName =
    pkm?.pokemon_v2_pokemonspecy.pokemon_v2_pokemonspeciesnames.find(
      (x) => getLocaleByPokeApiLangId(x.language_id, null) === params.lang
    )?.name || ""
  return {
    title: `${pkmName} | ${t(i18n)`Pokemon Calc`}`,
  }
}

export default async function PokemonDetailPageServer(props: any) {
  const pokemonData = await fetchPokemonDataWithOptions({ ssg: true })
  const pokemon = pokemonData.data.pokemon_v2_pokemon.find(
    (pkm) => pkm.id.toString() === props.params.id
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
        getLocaleByPokeApiLangId(xx.language_id) === i18n.locale
        // && x.id.toString() === props.params.id
      ) {
        nameI18nMessages[`pkm.name.${x.id}`] = xx.name
      }
    }
  }
  i18n.load(i18n.locale, nameI18nMessages)

  const defaultFormNameI18nMessages: any = {}
  for (const x of pokemonData.data.pokemon_v2_pokemon) {
    const i18nId = `pkm.defaultFormName.${x.id}`
    const defaultForm = (() => {
      const foundDefault = x.pokemon_v2_pokemonforms.find((x) => x.is_default)
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

  const ablitiesI18nMessages: any = {}
  for (const x of pokemonData.data.pokemon_v2_ability) {
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

  setI18n(i18n)

  if (!pokemon) {
    return <div>not found pokemon</div>
  }

  const pokemon2 = toPokemon2({
    pokemon,
    pokemon_v2_type: pokemonData.data.pokemon_v2_type,
    pokemon_v2_ability: pokemonData.data.pokemon_v2_ability,
    pokemon_v2_evolutionchain: pokemonData.data.pokemon_v2_evolutionchain,
    t: i18n.t,
  })

  return <PokemonDetailPage pokemon={pokemon2} id={props.params.id} />
}
