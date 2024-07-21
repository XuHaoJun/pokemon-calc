import { PokemonData } from "@/domain/pokemon"

// TODO
// import from nextjs config?
const basePath = "/pokemon-calc"

export async function fetchPokemonData() {
  return fetchPokemonDataWithOptions({ ssg: false })
}

export async function fetchPokemonDataWithOptions(
  options: { ssg: boolean } = { ssg: false }
) {
  const { ssg = false } = options
  if (ssg) {
    const pokemonData = (await import("../../public/data/pokemon-data.json"))
      .default
    return pokemonData as PokemonData
  }
  return fetch(`${basePath}/data/pokemon-data.json`).then(
    (res) => res.json() as Promise<PokemonData>
  )
}
