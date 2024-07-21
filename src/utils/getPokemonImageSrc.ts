export interface GetPokemonImageSrcOptions {
  type: "frontDefault" | "frontShiny" | "backDefault" | "backShiny"
}

export function getPokemonImageSrc(
  id: number,
  options?: GetPokemonImageSrcOptions
) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}
