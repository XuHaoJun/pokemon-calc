import { keepPreviousData, useQuery } from "@tanstack/react-query"

import * as Apis from "./index"

export function useFetchPokemonData() {
  return useQuery({
    queryKey: ["fetchPokemonData"],
    queryFn: Apis.fetchPokemonData,
    placeholderData: keepPreviousData,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })
}

export function useFetchPokemonMquery(body: { question: string }, queryOptions?: any) {
  return useQuery({
    queryKey: ["fetchPokemonMquery", body],
    queryFn: () => Apis.fetchPokemonMquery(body),
    placeholderData: keepPreviousData,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
    ...queryOptions
  })
}
