"use client"

import * as React from "react"
import { useFetchPokemonData } from "@/api/query"
import { Pokemon } from "@/domain/pokemon"
import { useLingui } from "@lingui/react"
import { ColumnDef } from "@tanstack/react-table"

import { useLoadPokemonLingui } from "@/hooks/useLoadPokemonLingui"

import { PokemonDataTable } from "./PokemonDataTable"

export function PokedexPage() {
  const query = useFetchPokemonData()
  const lingui = useLingui()
  const { updateOnce } = useLoadPokemonLingui({ targets: ["name", "type"] })
  const columns: ColumnDef<Pokemon>[] = [
    {
      accessorFn: (pkm) => lingui._(`pkm.name.${pkm.id}`),
      header: "Name",
    },
    {
      accessorFn: (pkm) => pkm.pokemon_v2_pokemonstats[0].base_stat,
      header: "Hp",
    },
  ]
  return (
    <PokemonDataTable
      columns={columns}
      data={query.data?.data.pokemon_v2_pokemon || []}
    />
  )
}
