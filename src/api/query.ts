import { keepPreviousData, useQuery } from "@tanstack/react-query"

import * as Apis from "./index"

export const QueryKeys = {
  _useFetchPokemonData() {
    return ["fetchPokemonData"]
  },
  _useFetchPokemonMquery(body?: any) {
    return ["fetchPokemonMquery", body].filter((x) => x)
  },
}

export function useFetchPokemonData() {
  return useQuery({
    queryKey: QueryKeys._useFetchPokemonData(),
    queryFn: Apis.fetchPokemonData,
    placeholderData: keepPreviousData,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })
}

export function useFetchPokemonMquery(
  body: { question: string },
  queryOptions?: any
) {
  const queryFn = () => Apis.fetchPokemonMquery(body)
  return useQuery<Awaited<ReturnType<typeof queryFn>>>({
    queryKey: QueryKeys._useFetchPokemonMquery(body),
    queryFn,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
    ...queryOptions,
  })
}
