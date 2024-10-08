import type { SamplePokeApIqueryQuery } from "./generated/pokeapi-schema"

export interface PokemonAllData {
  data: {
    pokemon_v2_pokemon: Pokemon[]
    pokemon_v2_language: PokemonLanguage[]
    pokemon_v2_type: PokemonType[]
    pokemon_v2_ability: PokemonAbility[]
    pokemon_v2_evolutionchain: PokemonEvolutionchain[]
    pokemon_v2_move: SamplePokeApIqueryQuery["pokemon_v2_move"]
  }
}

export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  pokemon_v2_pokemonstats: PokemonStats[]
  pokemon_v2_pokemonspecy: {
    id: number
    name: string
    evolution_chain_id: number
    pokemon_v2_pokemonspeciesnames: {
      language_id: number
      name: string
      id: number
    }[]
  }
  pokemon_v2_pokemontypes: {
    slot: number
    id: number
    type_id: number
  }[]
  pokemon_v2_pokemonabilities: PokemonAbilityFk[]
  pokemon_v2_pokemonforms: PokemonForm[]
  pokemon_v2_pokemonmoves: PokemonMoveFk[]
}

export interface PokemonMoveFk {
  id: number
  move_id: number
  version_group_id: number
  level: number
  order: number
  pokemon_v2_movelearnmethod: {
    id: number
    name: string
  }
  pokemon_v2_versiongroup: {
    id: number
    generation_id: number
  }
}

export interface Pokemon2 extends Pokemon {
  hp: number
  attack: number
  defense: number
  spAtk: number
  spDef: number
  speed: number
  total: number
  nameDisplay: string
  defaultFormNameDisplay: string
  types: PokemonType[]
  typesV2: string[]
  abilities: PokemonAbilityFk2[]
  evolutionchain?: PokemonEvolutionchain
  evolutionTree?: PokemonEvolutionTreeNode
  moves: Array<
    PokemonMoveFk & {
      nameDisplay: string
      flavorTextDisplay: string
    } & {
      move: Omit<
        Unarray<SamplePokeApIqueryQuery["pokemon_v2_move"]>,
        | "pokemon_v2_moveeffect"
        | "pokemon_v2_movenames"
        | "pokemon_v2_moveflavortexts"
      >
    }
  >
  typeDefensives: TypeDefensive[]
}

interface TypeDefensive {
  attackType: string
  effective: number
}

export interface PokemonAbilityFk2 extends PokemonAbilityFk {
  abilityFlavorTextDisplay: string
  nameDisplay: string
}

export interface PokemonAbilityFk {
  is_hidden: boolean
  slot: number
  ability_id: number
}

export interface PokemonStats {
  base_stat: number
  stat_id: number
}

export interface Abilityflavortext {
  flavor_text: string
  id: number
  language_id: number
  ability_id: number
}

export interface PokemonType {
  id: number
  name: string
  pokemon_v2_typenames: {
    name: string
    language_id: number
    id: number
  }[]
}

export interface PokemonLanguage {
  id: number
  name: string
}

export interface PokemonForm {
  id: number
  is_battle_only: boolean
  is_default: boolean
  is_mega: boolean
  form_name: string
  pokemon_v2_pokemonformnames: {
    id: number
    name: string
    language_id: number
  }[]
}

export interface PokemonAbility {
  id: number
  generation_id: number
  is_main_series: boolean
  name: string
  pokemon_v2_abilityflavortexts: {
    flavor_text: string
    language_id: number
  }[]
  pokemon_v2_abilitynames: {
    language_id: number
    name: string
  }[]
}

export interface PokemonEvolutionchain {
  id: number
  pokemon_v2_pokemonspecies: PokemonSpency[]
}

export interface PokemonSpency {
  id: number
  evolves_from_species_id: number
}

export interface PokemonEvolutionTreeNode {
  data: PokemonSpency
  parent?: PokemonEvolutionTreeNode
  children?: PokemonEvolutionTreeNode[]
}

// unwrap up to one level
export type Unarray<T> = T extends Array<infer U> ? U : T
