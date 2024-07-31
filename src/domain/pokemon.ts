export interface PokemonAllData {
  data: {
    pokemon_v2_pokemon: Pokemon[]
    pokemon_v2_language: PokemonLanguage[]
    pokemon_v2_type: PokemonType[]
    pokemon_v2_ability: PokemonAbility[]
  }
}

export interface Pokemon {
  id: number
  name: string
  height: number
  pokemon_v2_pokemonstats: PokemonStats[]
  pokemon_v2_pokemonspecy: {
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
  abilities: PokemonAbility2[]
}

export interface PokemonAbility2 extends PokemonAbilityFk {
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
    name: number
  }[]
}
