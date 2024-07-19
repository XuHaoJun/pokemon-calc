import { fetchPokemonDataWithOptions } from "@/api"
import { useFetchPokemonData } from "@/api/query"

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
  return <PokemonDetailPage pokemonData={pokemonData} id={props.params.idOrName} />
}
