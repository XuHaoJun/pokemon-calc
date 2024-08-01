import type {
  Pokemon,
  Pokemon2,
  PokemonAbilityFk2,
  PokemonAllData,
  PokemonType,
} from "@/domain/pokemon"
import type { I18n } from "@lingui/core"
import buildTree from "fast-tree-builder"
import * as R from "remeda"

import { binaraySearch } from "./binarySearch"

export interface ToPokemon2Params {
  pokemon: Pokemon
  pokemon_v2_type: PokemonAllData["data"]["pokemon_v2_type"]
  pokemon_v2_ability: PokemonAllData["data"]["pokemon_v2_ability"]
  pokemon_v2_evolutionchain: PokemonAllData["data"]["pokemon_v2_evolutionchain"]
  t: I18n["t"]
}

export function toPokemon2(params: ToPokemon2Params): Pokemon2 {
  const { pokemon: pkm, pokemon_v2_type, pokemon_v2_evolutionchain, t } = params
  const evolutionchain = binaraySearch(
    pokemon_v2_evolutionchain,
    pkm.pokemon_v2_pokemonspecy.evolution_chain_id,
    (id, el) => id - el.id,
    {
      firstMiddle: pkm.pokemon_v2_pokemonspecy.evolution_chain_id - 1,
    }
  )
  const evolutionTrees = evolutionchain
    ? buildTree(evolutionchain.pokemon_v2_pokemonspecies, {
        parentKey: "evolves_from_species_id",
      })
    : undefined
  const evolutionTree = evolutionTrees?.roots?.[0]
  return {
    ...pkm,
    hp: pkm.pokemon_v2_pokemonstats[0].base_stat,
    attack: pkm.pokemon_v2_pokemonstats[1].base_stat,
    defense: pkm.pokemon_v2_pokemonstats[2].base_stat,
    spAtk: pkm.pokemon_v2_pokemonstats[3].base_stat,
    spDef: pkm.pokemon_v2_pokemonstats[4].base_stat,
    speed: pkm.pokemon_v2_pokemonstats[5].base_stat,
    total: R.sumBy(pkm.pokemon_v2_pokemonstats, (x) => x.base_stat),
    nameDisplay: t(`pkm.name.${pkm.id}`),
    defaultFormNameDisplay:
      t(`pkm.defaultFormName.${pkm.id}`) === `pkm.defaultFormName.${pkm.id}`
        ? ""
        : t(`pkm.defaultFormName.${pkm.id}`),
    types: pkm.pokemon_v2_pokemontypes.map(
      (x) =>
        binaraySearch(
          pokemon_v2_type || [],
          x.type_id,
          (typeId, x) => typeId - x.id,
          { firstMiddle: x.type_id - 1 }
        ) as PokemonType
    ),
    abilities: pkm.pokemon_v2_pokemonabilities.map((x) => {
      return {
        ...x,
        nameDisplay: t(`pkm.ability.${x.ability_id}`),
        abilityFlavorTextDisplay: t(`pkm.abilityFlavorText.${x.ability_id}`),
      }
    }),
    evolutionchain,
    evolutionTree,
  }
}
