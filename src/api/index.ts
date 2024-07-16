const basePath = "/pokemon-calc"

export async function fetchPokemonData() {
  // return (await import("../data/pokemon-data.json")).default
  return fetch(`${basePath}/data/pokemon-data.json`).then((res) => res.json())
}
