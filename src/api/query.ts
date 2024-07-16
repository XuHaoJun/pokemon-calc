import { keepPreviousData, useQuery } from "@tanstack/react-query"

import * as Apis from "./index"

export function useFetchPokemonData() {
  return useQuery({
    queryKey: ["fetchPokemonData"],
    queryFn: Apis.fetchPokemonData,
    placeholderData: keepPreviousData,
  })
}
