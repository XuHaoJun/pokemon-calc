import { fetchPokemonDataWithOptions } from "@/api"
import { getAllI18nInstances } from "@/appRouterI18n"
import { getLocaleByPokeApiLangId } from "@/utils/getLocaleByPokeApiLangId"
import { getPokemonDefaultFormName } from "@/utils/getPokemonDefaultFormName"
import { toPokemon2 } from "@/utils/toPokemon2"
import { msg, t } from "@lingui/macro"
import { setI18n } from "@lingui/react/server"
import * as R from "remeda"

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
    const defaultFormName = getPokemonDefaultFormName(x, i18n)
    defaultFormNameI18nMessages[i18nId] = defaultFormName
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

  const moveI18nMessages: any = {}
  for (const x of pokemonData.data.pokemon_v2_move) {
    const i18nId = `pkm.move.${x.id}`
    for (const xx of x.pokemon_v2_movenames) {
      if (getLocaleByPokeApiLangId(xx.language_id as number) === i18n.locale) {
        moveI18nMessages[i18nId] = xx.name
      }
    }
    const i18nId2 = `pkm.moveFlavorTexts.${x.id}`
    for (const xx of x.pokemon_v2_moveflavortexts) {
      if (getLocaleByPokeApiLangId(xx.language_id as number) === i18n.locale) {
        moveI18nMessages[i18nId2] = xx.flavor_text
      }
    }
  }
  i18n.load(i18n.locale, moveI18nMessages)

  setI18n(i18n)

  if (!pokemon) {
    return <div>not found pokemon</div>
  }

  const pokemon2 = toPokemon2({
    pokemon,
    pokemon_v2_type: pokemonData.data.pokemon_v2_type,
    pokemon_v2_ability: pokemonData.data.pokemon_v2_ability,
    pokemon_v2_evolutionchain: pokemonData.data.pokemon_v2_evolutionchain,
    pokemon_v2_move: pokemonData.data.pokemon_v2_move,
    t: i18n.t,
  })

  const noI18nTypes = R.pipe(
    pokemonData.data.pokemon_v2_type,
    R.map((x) => ({
      id: x.id,
      name: x.name,
    })),
    R.filter(R.isNot((t) => ["stellar", "unknown", "shadow"].includes(t.name)))
  )

  return (
    <PokemonDetailPage
      id={props.params.id}
      pokemon={pokemon2}
      types={noI18nTypes}
    />
  )
}
