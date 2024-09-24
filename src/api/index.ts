import { PokemonAllData } from "@/domain/pokemon"
import axios from "axios"

export const axiosMainInstance = axios.create({
  adapter: "fetch",
  baseURL: "http://127.0.0.1:8000",
})

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
    return pokemonData as PokemonAllData
  }
  return fetch(`${basePath}/data/pokemon-data.json`).then(
    (res) => res.json() as Promise<PokemonAllData>
  )
}

export async function fetchPokemonMquery({ question }: { question: string }) {
  return axiosMainInstance
    .get<{ questionNumTokens: number; mquery: string }>("/mquery", {
      params: {
        question,
      },
    })
    .then((res) => res.data)
}
