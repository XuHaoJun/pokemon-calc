export interface PokemonData {
  data: {
    pokemon_v2_pokemon: Pokemon[]
    pokemon_v2_language: PokemonLanguage[]
    pokemon_v2_type: PokemonType[]
    pokemon_v2_abilityflavortext: Abilityflavortext[]
  }
}

export interface Pokemon {
  id: number
  name: string
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
  pokemon_v2_pokemonabilities: {
    is_hidden: boolean
    slot: number
    ability_id: number
  }[]
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