import Image from "next/image"
import NextLink from "next/link"
import { Pokemon } from "@/domain/pokemon"
import { getPokemonImageSrc } from "@/utils/getPokemonImageSrc"
import { useLingui } from "@lingui/react"
import { ExternalLinkIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { badgeVariants } from "@/components/ui/badge"

import { PokemonStatsChart } from "./PokemonStatsChart"

export interface PokemonDetailPageProps {
  id: number
  pokemon: Pokemon
}

export function PokemonDetailPage(props: PokemonDetailPageProps) {
  const { id } = props
  const lingui = useLingui()
  const bulbapediaHref = `https://bulbapedia.bulbagarden.net/wiki/${props.pokemon.name}_(Pokémon)`
  const _52pokeHref = `https://wiki.52poke.com/wiki/${props.pokemon.name}`
  return (
    <div className="container flex flex-col gap-2 md:sticky md:top-[60px]">
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">
        {lingui._(`pkm.name.${id}`)}
      </h1>
      <Image
        className="border"
        alt={lingui._(`pkm.name.${id}`)}
        width={200}
        height={200}
        src={getPokemonImageSrc(id)}
        priority
      />
      <PokemonStatsChart pokemon={props.pokemon} />
      <div>
        <NextLink
          href={bulbapediaHref}
          target="_blank"
          rel="noreferrer"
          className={cn(badgeVariants({ variant: "secondary" }), "gap-1")}
        >
          Bulbapedia
          <ExternalLinkIcon className="h-3 w-3" />
        </NextLink>
      </div>
      <div>
        <NextLink
          href={_52pokeHref}
          target="_blank"
          rel="noreferrer"
          className={cn(badgeVariants({ variant: "secondary" }), "gap-1")}
        >
          52poke
          <ExternalLinkIcon className="h-3 w-3" />
        </NextLink>
      </div>
    </div>
  )
}