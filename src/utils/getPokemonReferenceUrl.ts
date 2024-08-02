import { Pokemon2 } from "@/domain/pokemon"

export function getBulbapediaHref(pkm: Pokemon2): string {
  const name = pkm.pokemon_v2_pokemonspecy.name
    .split("-")
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join("_")
  return `https://bulbapedia.bulbagarden.net/wiki/${name}_(Pokémon)`
}

export function get52pokeHref(pkm: Pokemon2): string {
  const name = pkm.pokemon_v2_pokemonspecy.name
    .split("-")
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join(" ")
  return `https://wiki.52poke.com/wiki/${name}`
}

export function getPokeRogueDexHref(pkm: Pokemon2): string {
  const name = pkm.pokemon_v2_pokemonspecy.name
    .toUpperCase()
    .split("-")
    .join("_")
  return `https://ydarissep.github.io/PokeRogue-Pokedex/?species=SPECIES_${name}&table=speciesTable&`
}
