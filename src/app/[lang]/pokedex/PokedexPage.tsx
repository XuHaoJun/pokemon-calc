"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useFetchPokemonData } from "@/api/query"
import { flexsearchAtom, flexsearchIsIndexingAtom } from "@/atoms"
import type { Pokemon2, PokemonType } from "@/domain/pokemon"
import { binaraySearch } from "@/utils/binarySearch"
import { getPokemonImageSrc } from "@/utils/getPokemonImageSrc"
import { toPokemon2 } from "@/utils/toPokemon2"
import { useLingui } from "@lingui/react"
import { ColumnDef, HeaderContext } from "@tanstack/react-table"
import { useAtom, useAtomValue } from "jotai"
import { ScopeProvider } from "jotai-scope"
import { ArrowDown, ArrowUp } from "lucide-react"
import { create } from "mutative"
import { LazyLoadImage } from "react-lazy-load-image-component"
import * as R from "remeda"
import sift from "sift"

import { useLoadPokemonLingui } from "@/hooks/useLoadPokemonLingui"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DebouncedInput } from "@/components/DebouncedInput"
import { Link } from "@/components/Link"
import { TypeBadge } from "@/components/TypeBadge"

import * as pokdexAtoms from "./pokedexAtoms"
import { PokemonDataTable } from "./PokemonDataTable"

export function PokedexPage() {
  return (
    <ScopeProvider atoms={pokdexAtoms.allAtoms}>
      <PokedexPageBase />
    </ScopeProvider>
  )
}

export function PokedexPageBase() {
  const query = useFetchPokemonData()
  const lingui = useLingui()
  const { updateOnce } = useLoadPokemonLingui({ targets: ["name"] })
  const columns: ColumnDef<Pokemon2>[] = React.useMemo(
    () => [
      {
        accessorKey: "nameDisplay",
        header: (headerContext) => {
          return <MyNameHeader headerContext={headerContext}>Name</MyNameHeader>
        },
        enableSorting: false,
        cell: (cellCtx) => {
          const { row } = cellCtx
          const { id, nameDisplay, defaultFormNameDisplay } = row.original
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
                <div className="flex flex-col">
                  <span>{nameDisplay}</span>
                  <small className="text-muted-foreground">
                    {defaultFormNameDisplay}
                  </small>
                </div>
              </Link>
            </div>
          )
        },
      },
      {
        accessorKey: "types",
        header: "Types",
        enableSorting: false,
        cell: (cellCtx) => {
          const { row } = cellCtx
          const types = row.getValue<PokemonType[]>("types")
          return (
            <div className="flex flex-col gap-1">
              {types.map((x) => (
                <TypeBadge key={x.id} type={x.name} />
              ))}
            </div>
          )
        },
      },
      {
        accessorKey: "hp",
        header: (headerContext) => {
          return (
            <MyStatHeader fieldName="hp" headerContext={headerContext}>
              Hp
            </MyStatHeader>
          )
        },
      },
      {
        accessorKey: "attack",
        header: (headerContext) => {
          return (
            <MyStatHeader fieldName="attack" headerContext={headerContext}>
              Attack
            </MyStatHeader>
          )
        },
      },
      {
        accessorKey: "defense",
        header: (headerContext) => {
          return (
            <MyStatHeader fieldName="defense" headerContext={headerContext}>
              Defense
            </MyStatHeader>
          )
        },
      },
      {
        accessorKey: "spAtk",
        header: (headerContext) => {
          return (
            <MyStatHeader fieldName="spAtk" headerContext={headerContext}>
              Sp.Atk
            </MyStatHeader>
          )
        },
      },
      {
        accessorKey: "spDef",
        header: (headerContext) => {
          return (
            <MyStatHeader fieldName="spDef" headerContext={headerContext}>
              Sp.Def
            </MyStatHeader>
          )
        },
      },
      {
        accessorKey: "speed",
        header: (headerContext) => {
          return (
            <MyStatHeader fieldName="speed" headerContext={headerContext}>
              Speed
            </MyStatHeader>
          )
        },
      },
      {
        accessorKey: "total",
        header: (headerContext) => {
          return (
            <MyStatHeader
              max={1125}
              fieldName="total"
              headerContext={headerContext}
            >
              Total
            </MyStatHeader>
          )
        },
      },
    ],
    []
  )
  const data = React.useMemo<Pokemon2[]>(
    () =>
      lingui._("pkm.name.1") === "pkm.name.1"
        ? []
        : (query.data?.data.pokemon_v2_pokemon || []).map((pkm) =>
            toPokemon2({
              pokemon: pkm,
              t: lingui._,
              pokemon_v2_type: query.data?.data.pokemon_v2_type || [],
              pokemon_v2_ability: query.data?.data.pokemon_v2_ability || [],
            })
          ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query.data, lingui, updateOnce]
  )

  const [filter] = useAtom(pokdexAtoms.siftFilterAtom)
  const filterTester = React.useMemo(() => sift(filter), [filter])
  // const finalQueryString = React.useMemo(() => {
  //   if (!R.isDeepEqual(filter, pokdexAtoms.defaultSiftFilter)) {
  //     const params = new URLSearchParams({
  //       filter: JSON.stringify(filter),
  //     })
  //     return params.toString()
  //   } else {
  //     return ""
  //   }
  // }, [filter])
  // const router = useRouter()
  // const pathname = usePathname()
  // React.useEffect(() => {
  //   router.replace(`${pathname}?${finalQueryString}`)
  // }, [finalQueryString, pathname, router])

  const flexsearchIsIndexing = useAtomValue(flexsearchIsIndexingAtom)

  const flexsearchFilter = useAtomValue(pokdexAtoms.flexsearchFilterAtom)

  const { index: flexsearchIndex } = useAtomValue(flexsearchAtom)

  const dataFilterByFlexsearch = React.useMemo(() => {
    if (
      !flexsearchIndex ||
      flexsearchFilter.name === "" ||
      flexsearchIsIndexing
    ) {
      return data
    }
    const searchResult = flexsearchIndex.search(flexsearchFilter.name)
    return searchResult
      .flatMap((x) => x.result)
      .map((_id) => {
        const id = _id as number
        return binaraySearch(data, id, (targetId, x) => targetId - x.id, {
          firstMiddle: id - 1,
        }) as Pokemon2
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, flexsearchFilter.name, flexsearchIndex, flexsearchIsIndexing])

  const finalData = React.useMemo(
    () => dataFilterByFlexsearch.filter(filterTester),
    [dataFilterByFlexsearch, filterTester]
  )

  if (query.isLoading) {
    return <Skeleton className="w-100% h-[500px]" />
  }

  return (
    <div className="md:container flex flex-col gap-2 py-6">
      <PokemonDataTable columns={columns} data={finalData} />
    </div>
  )
}

interface MyHeaderProps {
  headerContext: HeaderContext<Pokemon2, unknown>
}

interface MyNameHeaderProps extends MyHeaderProps {}

function MyNameHeader({
  headerContext,
  children,
}: React.PropsWithChildren<MyNameHeaderProps>) {
  const [filter, setFilter] = useAtom(pokdexAtoms.flexsearchFilterAtom)
  return (
    <div className="flex flex-col gap-1 pb-2">
      {children}
      <DebouncedInput
        className="h-7"
        value={filter.name}
        onChange={(v) =>
          setFilter(
            create(filter, (draft) => {
              draft.name = `${v}`
            })
          )
        }
      />
    </div>
  )
}

interface MyStatHeaderProps extends MyHeaderProps {
  fieldName: pokdexAtoms.StatFielsName
  min?: number
  max?: number
}

function MyStatHeader({
  fieldName,
  headerContext,
  children,
  min = 1,
  max = 255,
}: React.PropsWithChildren<MyStatHeaderProps>) {
  const { column } = headerContext
  const isSorted = column.getIsSorted()
  const [filter, setFilter] = useAtom(pokdexAtoms.siftFilterAtom)
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
      <DebouncedInput
        type="number"
        className="h-7 w-[90px]"
        min={min}
        max={max}
        value={filter[fieldName].$gte}
        onChange={(v) =>
          setFilter(
            create(filter, (draft) => {
              draft[fieldName].$gte = v as number
            })
          )
        }
      />
      <DebouncedInput
        type="number"
        className="h-7 w-[90px]"
        min={min}
        max={max}
        value={filter[fieldName].$lte}
        onChange={(v) =>
          setFilter(
            create(filter, (draft) => {
              draft[fieldName].$lte = v as number
            })
          )
        }
      />
    </div>
  )
}
