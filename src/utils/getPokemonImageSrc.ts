export interface GetPokemonImageSrcOptions {
  type: "frontDefault"
}

export function getPokemonImageSrc(
  id: number,
  options?: GetPokemonImageSrcOptions
) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}
