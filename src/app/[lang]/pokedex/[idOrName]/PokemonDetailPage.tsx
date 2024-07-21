import Image from "next/image"
import { Pokemon } from "@/domain/pokemon"
import { getPokemonImageSrc } from "@/utils/getPokemonImageSrc"
import { useLingui } from "@lingui/react"

import { PokemonStatsChart } from "./PokemonStatsChart"

export interface PokemonDetailPageProps {
  id: number
  pokemon: Pokemon
}

export function PokemonDetailPage(props: PokemonDetailPageProps) {
  const { id } = props
  const lingui = useLingui()
  const bulbapediaHref = `https://bulbapedia.bulbagarden.net/wiki/${props.pokemon.name}_(Pokémon)`
  return (
    <div className="container flex flex-col gap-2 md:sticky md:top-[60px]">
      <Image
        className="hover:animate-bounce"
        alt={lingui._(`pkm.name.${id}`)}
        width={64}
        height={64}
        src={getPokemonImageSrc(id)}
        priority
      />
      {lingui._(`pkm.name.${id}`)}
      <PokemonStatsChart pokemon={props.pokemon} />
      <a href={bulbapediaHref} target="_blank">Bulbapedia</a>
    </div>
  )
}
