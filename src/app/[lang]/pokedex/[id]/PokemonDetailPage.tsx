import * as React from "react"
import Image from "next/image"
import NextLink from "next/link"
import { TYPE_COLORS } from "@/domain/constants"
import { Pokemon2, PokemonEvolutionTreeNode } from "@/domain/pokemon"
import { getPokemonImageSrc } from "@/utils/getPokemonImageSrc"
import { treeToArrayByDepth } from "@/utils/treeToArrayByDepth"
import { Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { lighten } from "color2k"
import { ExternalLinkIcon } from "lucide-react"
import * as R from "remeda"

import { cn } from "@/lib/utils"
import { badgeVariants } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/components/Link"
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
    if (color1 === color2) {
      // TODO
      // light use lighten, dark use darken
      return lighten(color1, 0.2)
    }
    return `linear-gradient(to right, ${color1}, ${color2})`
  }, [pokemon.types])
  return (
    <div className="mx-auto w-full min-h-[calc(100vh-60px)]">
      <div
        className="container flex flex-col items-center gap-2 relative"
        style={{ background: backgroundCss }}
      >
        <Image
          className="absolute hover:animate-zoom-in-out"
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
                paddingTop: R.clamp((pokemon.height / 1) * 3.5, { max: 70 }),
              }}
            >
              <div className="flex flex-col items-center justify-center">
                <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
                  {pokemon.nameDisplay}
                </h1>
                <span className="text-muted-foreground pl-2">
                  {pokemon.defaultFormNameDisplay}
                </span>
                <div className="flex flex-col mt-3">
                  <div className=" flex justify-center items-center gap-1">
                    {pokemon.types.map((x) => (
                      <TypeBadge
                        className="w-[100px]"
                        key={x.name}
                        type={x.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Abilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-8 flex-wrap md:justify-center items-baseline">
                  {pokemon.abilities.map((x) => (
                    <div key={x.ability_id} className="flex flex-col gap-1">
                      <h3 className="text-xl font-bold">
                        {x.nameDisplay}
                        {x.is_hidden && (
                          <small className="text-muted-foreground text-sm ml-1">
                            <Trans>Hidden Ability</Trans>
                          </small>
                        )}
                      </h3>
                      <small className="text-muted-foreground text-sm md:max-w-[200px] whitespace-pre-line">
                        {x.abilityFlavorTextDisplay}
                      </small>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <PokemonStatsChart pokemon={props.pokemon} />

            {pokemon.evolutionchain && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Trans>Envolution</Trans>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex md:justify-center">
                  <PokemonEvolutionChainTree pokemon={pokemon} />
                </CardContent>
              </Card>
            )}

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
    </div>
  )
}

function PokemonEvolutionChainTree({ pokemon }: { pokemon: Pokemon2 }) {
  const { evolutionTree } = pokemon
  if (!evolutionTree) {
    return null
  }
  return (
    <div className="flex items-center">
      {treeToArrayByDepth(evolutionTree).map((nodes, i) => {
        return (
          <React.Fragment key={i}>
            <div className="flex flex-col">
              {nodes.map((x) => {
                return <PokemonEvolutionNode key={x.data.id} node={x} />
              })}
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

function PokemonEvolutionNode({ node }: { node: PokemonEvolutionTreeNode }) {
  const lingui = useLingui()
  return (
    <div className="flex items-center">
      {node.parent && <big>→</big>}
      <Link href={`/pokedex/${node.data.id}`} key={node.data.id}>
        <div className="flex flex-col items-center">
          <Image
            className="hover:animate-zoom-in-out"
            alt={lingui._(`pkm.name.${node.data.id}`)}
            width={80}
            height={80}
            src={getPokemonImageSrc(node.data.id)}
            priority
          />
          <p>{lingui._(`pkm.name.${node.data.id}`)}</p>
        </div>
      </Link>
    </div>
  )
}
