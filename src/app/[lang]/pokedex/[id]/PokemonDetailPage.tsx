import * as React from "react"
import Image from "next/image"
import { TYPE_COLORS } from "@/domain/constants"
import {
  Pokemon2,
  PokemonEvolutionTreeNode,
  PokemonType,
} from "@/domain/pokemon"
import { getPokemonImageSrc } from "@/utils/getPokemonImageSrc"
import {
  get52pokeHref,
  getBulbapediaHref,
  getPokemonDatabaseHref,
  getPokeRogueDexHref,
} from "@/utils/getPokemonReferenceUrl"
import { treeToArrayByDepth } from "@/utils/treeToArrayByDepth"
import { Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { lighten } from "color2k"
import * as R from "remeda"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "@/components/ExternalLink"
import { Link } from "@/components/Link"
import { TypeBadge } from "@/components/TypeBadge"

import { MoveTable } from "./MoveTable"
import { PokemonStatsChart } from "./PokemonStatsChart"
import { TypeDefensiveResistance } from "./TypeDefensiveResistance"

export type TypeNoI18n = Pick<PokemonType, "id" | "name">

export interface PokemonDetailPageProps {
  id: number
  pokemon: Pokemon2
  types: TypeNoI18n[]
}

export function PokemonDetailPage(props: PokemonDetailPageProps) {
  const { id, pokemon } = props
  const lingui = useLingui()
  const bulbapediaHref = React.useMemo(
    () => getBulbapediaHref(pokemon),
    [pokemon]
  )
  const _52pokeHref = React.useMemo(() => get52pokeHref(pokemon), [pokemon])
  const _pokemonDatabaseHref = React.useMemo(
    () => getPokemonDatabaseHref(pokemon),
    [pokemon]
  )
  const _pokeRogueDexHref = React.useMemo(
    () => getPokeRogueDexHref(pokemon),
    [pokemon]
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

  const moveGroups = React.useMemo(
    () => R.groupBy(pokemon.moves, (x) => x.pokemon_v2_movelearnmethod.name),
    [pokemon.moves]
  )

  const eggMoves = React.useMemo(() => {
    return R.pipe(
      moveGroups["egg"] || [],
      R.sortBy((x) => x.order)
    )
  }, [moveGroups])

  const levelUpMoves = React.useMemo(() => {
    return R.pipe(
      moveGroups["level-up"] || [],
      R.filter((x) => x.pokemon_v2_movelearnmethod.name === "level-up"),
      R.sortBy((x) => x.level)
    )
  }, [moveGroups])

  const machineMoves = React.useMemo(() => {
    return R.pipe(
      moveGroups["machine"] || [],
      R.sortBy((x) => x.order)
    )
  }, [moveGroups])

  return (
    <div className="mx-auto w-full min-h-[calc(100vh-60px)]">
      <div
        className="container px-2 md:px-6 flex flex-col items-center gap-2 rounded relative"
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
                <span className="text-base text-muted-foreground">
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
                <CardTitle>
                  <Trans>Type Defensive</Trans>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-1 flex-wrap md:justify-center">
                {props.types.map((x) => (
                  <TypeDefensiveResistance
                    key={x.id}
                    offensiveType={x.name}
                    defensiveTypes={pokemon.types}
                  />
                ))}
              </CardContent>
            </Card>

            {levelUpMoves.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Trans>Level Up Moves</Trans>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex gap-1 flex-col md:justify-center">
                  <MoveTable moves={levelUpMoves} />
                </CardContent>
              </Card>
            )}

            {eggMoves.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Trans>Egg Moves</Trans>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex gap-1 flex-col md:justify-center">
                  <MoveTable hideColumns={["level"]} moves={eggMoves} />
                </CardContent>
              </Card>
            )}

            {machineMoves.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Trans>TM/HM Moves</Trans>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex gap-1 flex-col md:justify-center">
                  <MoveTable hideColumns={["level"]} moves={machineMoves} />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>References</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2 flex-wrap">
                <ExternalLink href={bulbapediaHref}>bulbapedia</ExternalLink>
                <ExternalLink href={_52pokeHref}>52poke</ExternalLink>
                <ExternalLink href={_pokemonDatabaseHref}>
                  Pokemon Database
                </ExternalLink>
                <ExternalLink href={_pokeRogueDexHref}>
                  PokeRogue Dex
                </ExternalLink>
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
