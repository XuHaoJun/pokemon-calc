"use client"

import { getPokemonImageSrc } from "@/utils/getPokemonImageSrc"
import { useLingui } from "@lingui/react"
import { LazyLoadImage } from "react-lazy-load-image-component"

import { useLoadPokemonLingui } from "@/hooks/useLoadPokemonLingui"

export function PokemonDetailPage(props: any) {
  useLoadPokemonLingui({ targets: ["name"] })
  const { id } = props
  const lingui = useLingui()
  return (
    <div>
      TODO
      <LazyLoadImage
        alt={lingui._(`pkm.name.${id}`)}
        width={64}
        height={64}
        src={getPokemonImageSrc(id)}
      />
      {lingui._(`pkm.name.${id}`)}
    </div>
  )
}
