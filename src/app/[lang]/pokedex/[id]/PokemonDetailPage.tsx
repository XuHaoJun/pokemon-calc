import * as React from "react"
import Image from "next/image"
import NextLink from "next/link"
import { TYPE_COLORS } from "@/domain/constants"
import { Pokemon2 } from "@/domain/pokemon"
import { getPokemonImageSrc } from "@/utils/getPokemonImageSrc"
import { Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { lighten } from "color2k"
import { ExternalLinkIcon } from "lucide-react"
import * as R from "remeda"

import { cn } from "@/lib/utils"
import { badgeVariants } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TypeBadge } from "@/components/TypeBadge"

import { PokemonStatsChart } from "./PokemonStatsChart"

export interface PokemonDetailPageProps {
  id: number
  pokemon: Pokemon2
}

export function PokemonDetailPage(props: PokemonDetailPageProps) {
  const { id, pokemon } = props
  const lingui = useLingui()
  const bulbapediaHref = React.useMemo(
    () =>
      `https://bulbapedia.bulbagarden.net/wiki/${pokemon.name.split("-")[0]}`,
    [pokemon.name]
  )
  const _52pokeHref = React.useMemo(
    () => `https://wiki.52poke.com/wiki/${pokemon.name.split("-")[0]}`,
    [pokemon.name]
  )
  const backgroundCss = React.useMemo(() => {
    const color1 = TYPE_COLORS[pokemon.types[0].name]
    const color2 = TYPE_COLORS[pokemon.types[1]?.name] || color1
    const finalColor2 = color1 === color2 ? lighten(color2, 0.2) : color2
    return `linear-gradient(to right, ${color1}, ${finalColor2})`
  }, [pokemon.types])
  return (
    <div
      className="container flex flex-col items-center gap-2 relative"
      style={{ background: backgroundCss }}
    >
      <Image
        className="absolute"
        style={{}}
        alt={lingui._(`pkm.name.${id}`)}
        width={200}
        height={200}
        src={getPokemonImageSrc(id)}
        priority
      />
      <div className="h-[100px]" />

      <Card className="w-full">
        <CardHeader>
          <CardTitle
            style={{
              paddingTop: R.clamp((pokemon.height / 1) * 4, { max: 70 }),
            }}
          >
            <div className="flex flex-col items-center justify-center">
              <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">
                {lingui._(`pkm.name.${id}`)}
              </h1>
              <span className="text-gray-500 pl-2">
                {lingui._(`pkm.defaultFormName.${id}`) ===
                `pkm.defaultFormName.${id}`
                  ? ""
                  : lingui._(`pkm.defaultFormName.${id}`)}
              </span>
              <div className="flex gap-1">
                {pokemon.types.map((x) => (
                  <TypeBadge className="px-2 py-1" key={x.name} type={x.name} />
                ))}
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <PokemonStatsChart pokemon={props.pokemon} />

          <Card>
            <CardHeader>
              <CardTitle>References</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <div>
                <NextLink
                  href={bulbapediaHref}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    badgeVariants({ variant: "secondary" }),
                    "gap-1"
                  )}
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
                  className={cn(
                    badgeVariants({ variant: "secondary" }),
                    "gap-1"
                  )}
                >
                  52poke
                  <ExternalLinkIcon className="h-3 w-3" />
                </NextLink>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
