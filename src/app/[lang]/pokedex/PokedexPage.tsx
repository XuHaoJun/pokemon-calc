"use client"

import * as React from "react"
import { useFetchPokemonData } from "@/api/query"
import type { Pokemon } from "@/domain/pokemon"
import { getPokemonImageSrc } from "@/utils/getPokemonImageSrc"
import { useLingui } from "@lingui/react"
import { ColumnDef, HeaderContext } from "@tanstack/react-table"
import { ArrowDown, ArrowUp } from "lucide-react"
import { LazyLoadImage } from "react-lazy-load-image-component"
import * as R from "remeda"

import { useLoadPokemonLingui } from "@/hooks/useLoadPokemonLingui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { DebouncedInput } from "@/components/DebouncedInput"
import { Link } from "@/components/Link"

import { PokemonDataTable } from "./PokemonDataTable"

interface Pokemon2 extends Pokemon {
  hp: number
  attack: number
  defense: number
  spAtk: number
  spDef: number
  speed: number
  total: number
  nameDisplay: string
}

export function PokedexPage() {
  const query = useFetchPokemonData()
  const lingui = useLingui()
  const { updateOnce } = useLoadPokemonLingui({ targets: ["name", "type"] })
  const columns: ColumnDef<Pokemon2>[] = [
    {
      accessorKey: "nameDisplay",
      header: (headerContext) => {
        return <MyNameHeader headerContext={headerContext}>Name</MyNameHeader>
      },
      enableSorting: false,
      cell: (cellCtx) => {
        const { row } = cellCtx
        const { id } = row.original
        const nameDisplay = row.getValue<string>("nameDisplay")
        const href = `/pokedex/${id}`
        return (
          <div className="flex items-center gap-2 min-w-[120px] min-h-[50px]">
            <Link href={href}>
              <LazyLoadImage
                alt={nameDisplay}
                width={50}
                height={50}
                src={getPokemonImageSrc(id)}
              />
            </Link>
            <Link href={href} className="text-blue-600 hover:text-blue-800">
              {nameDisplay}
            </Link>
          </div>
        )
      },
    },
    {
      accessorKey: "hp",
      header: (headerContext) => {
        return <MyHeader headerContext={headerContext}>Hp</MyHeader>
      },
    },
    {
      accessorKey: "attack",
      header: (headerContext) => {
        return <MyHeader headerContext={headerContext}>Attack</MyHeader>
      },
    },
    {
      accessorKey: "defense",
      header: (headerContext) => {
        return <MyHeader headerContext={headerContext}>Defense</MyHeader>
      },
    },
    {
      accessorKey: "spAtk",
      header: (headerContext) => {
        return <MyHeader headerContext={headerContext}>Sp.Atk</MyHeader>
      },
    },
    {
      accessorKey: "spDef",
      header: (headerContext) => {
        return <MyHeader headerContext={headerContext}>Sp.Def</MyHeader>
      },
    },
    {
      accessorKey: "speed",
      header: (headerContext) => {
        return <MyHeader headerContext={headerContext}>Speed</MyHeader>
      },
    },
    {
      accessorKey: "total",
      header: (headerContext) => {
        return <MyHeader headerContext={headerContext}>Total</MyHeader>
      },
    },
  ]
  const data = React.useMemo<Pokemon2[]>(
    () =>
      lingui._("pkm.name.1") === "pkm.name.1"
        ? []
        : (query.data?.data.pokemon_v2_pokemon || []).map((pkm) => ({
            ...pkm,
            hp: pkm.pokemon_v2_pokemonstats[0].base_stat,
            attack: pkm.pokemon_v2_pokemonstats[1].base_stat,
            defense: pkm.pokemon_v2_pokemonstats[2].base_stat,
            spAtk: pkm.pokemon_v2_pokemonstats[3].base_stat,
            spDef: pkm.pokemon_v2_pokemonstats[4].base_stat,
            speed: pkm.pokemon_v2_pokemonstats[5].base_stat,
            total: R.sumBy(pkm.pokemon_v2_pokemonstats, (x) => x.base_stat),
            nameDisplay: lingui._(`pkm.name.${pkm.id}`),
          })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query.data, lingui, updateOnce]
  )
  if (query.isLoading) {
    return <Skeleton className="w-100% h-[500px]" />
  }
  return (
    <div className="md:container flex flex-col gap-2 py-6">
      <PokemonDataTable columns={columns} data={data} />
    </div>
  )
}

interface MyHeaderProps {
  headerContext: HeaderContext<Pokemon2, unknown>
}

function MyNameHeader({
  headerContext,
  children,
}: React.PropsWithChildren<MyHeaderProps>) {
  const { column } = headerContext
  return (
    <div className="flex flex-col gap-1 pb-2">
      {children}
      <DebouncedInput className="h-7" />
    </div>
  )
}

function MyHeader({
  headerContext,
  children,
}: React.PropsWithChildren<MyHeaderProps>) {
  const { column } = headerContext
  const isSorted = column.getIsSorted()
  return (
    <div className="flex flex-col gap-1 pb-2">
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(
            column.getIsSorted() === false
              ? true
              : column.getIsSorted() === "asc"
          )
        }
      >
        {children}
        {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
        {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
        {isSorted === false && <div className="ml-2 h-4 w-4" />}
      </Button>
      <DebouncedInput type="number" className="h-7" value={1} />
      <DebouncedInput type="number" className="h-7" value={255} />
    </div>
  )
}
