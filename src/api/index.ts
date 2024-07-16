export async function fetchPokemonData() {
  return (await import("../data/pokemon-data.json")).default
}
