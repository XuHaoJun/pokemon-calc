"use client"

import * as React from "react"
import { useFetchPokemonData } from "@/api/query"
import { flexsearchAtom, flexsearchIsIndexingAtom } from "@/atoms"
import { getLocaleByPokeApiLangId } from "@/utils/getLocaleByPokeApiLangId"
import { getPokemonImageSrc } from "@/utils/getPokemonImageSrc"
import { getRandomInt } from "@/utils/remebdaExt"
import { msg, Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { DialogTitle } from "@radix-ui/react-dialog"
import { useDebounce } from "ahooks"
import { CommandLoading } from "cmdk"
import type { Document, SimpleDocumentSearchResultSetUnit } from "flexsearch"
import { useAtom, useSetAtom } from "jotai"
import { LazyLoadImage } from "react-lazy-load-image-component"
import * as R from "remeda"

import { cn } from "@/lib/utils"
import { useLoadPokemonLingui } from "@/hooks/useLoadPokemonLingui"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import { Link } from "./Link"

export function CommandMenu({ ...props }: any) {
  const [open, setOpen] = React.useState(false)
  const [openAndSearched, setOpenAndSearched] = React.useState(false)

  useLoadPokemonLingui({ targets: ["name"], enabled: open })

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const [searchText, setSearchText] = React.useState<string>("")
  const debouncedSearchText = useDebounce(searchText, {
    wait: 400,
    maxWait: 400 * 3,
  })
  const [searchResult, setSearchResult] = React.useState<
    SimpleDocumentSearchResultSetUnit[]
  >([])

  React.useEffect(() => {
    if (searchText && openAndSearched === false) {
      setOpenAndSearched(true)
    }
  }, [searchText])

  const lingui = useLingui()

  const [{ index: flexsearchIndex }] = useAtom(flexsearchAtom)

  const [isSearching, setIsSearching] = React.useState(false)
  React.useEffect(() => {
    async function run() {
      if (flexsearchIndex) {
        setIsSearching(true)
        const nextSearchResult =
          await flexsearchIndex.searchAsync(debouncedSearchText)
        setSearchResult(nextSearchResult)
        setIsSearching(false)
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchText, flexsearchIndex])

  const [randomPokemonIds, setRandomPokemonIds] = React.useState(
    getRandomPokemonIds()
  )
  React.useEffect(() => {
    if (open) {
      setRandomPokemonIds(getRandomPokemonIds())
    }
  }, [open])

  React.useEffect(() => {
    if (open === false && openAndSearched) {
      setOpenAndSearched(false)
    }
  }, [open])

  React.useEffect(() => {
    if (open === false && searchText) {
      setSearchText("")
      setSearchResult([])
    }
  }, [open])

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">
          <Trans>Search Pokemon...</Trans>
        </span>
        <span className="inline-flex lg:hidden">
          <Trans>Search...</Trans>
        </span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        commandProps={{ shouldFilter: false }}
      >
        <DialogTitle className="sr-only">
          <Trans>Search...</Trans>
        </DialogTitle>
        <CommandInput
          value={searchText}
          onValueChange={setSearchText}
          placeholder={lingui._(msg`Type a search...`)}
        />
        <CommandList>
          <CommandEmpty>
            <div className="min-h-[180px]">
              <Trans>No results found.</Trans>
            </div>
          </CommandEmpty>
          {isSearching && <CommandLoading>Searching…</CommandLoading>}
          {Boolean(searchResult.length) && (
            <CommandGroup heading="Pokemons">
              {searchResult
                .flatMap((x) => x.result)
                .map((id) => (
                  <PokemonCommandItem
                    key={id}
                    id={id as number}
                    onSelect={() => setOpen(false)}
                  />
                ))}
            </CommandGroup>
          )}
          {Boolean(searchText) === false &&
            openAndSearched === false &&
            open && (
              <CommandGroup heading="Random Pokemons">
                {randomPokemonIds.map((id) => (
                  <PokemonCommandItem
                    key={id}
                    id={id}
                    onSelect={() => setOpen(false)}
                  />
                ))}
              </CommandGroup>
            )}
        </CommandList>
      </CommandDialog>
    </>
  )
}

function getRandomPokemonIds() {
  return R.unique([
    getRandomInt(1, 1025),
    getRandomInt(1, 1025),
    getRandomInt(1, 1025),
  ])
}

function PokemonCommandItem({
  id,
  onSelect,
}: {
  id: number
  onSelect?: () => void
}) {
  const lingui = useLingui()
  const defaultFormNameDisplay =
    lingui._(`pkm.defaultFormName.${id}`) === `pkm.defaultFormName.${id}`
      ? ""
      : lingui._(`pkm.defaultFormName.${id}`)
  return (
    <Link key={id} href={`/pokedex/${id}`}>
      <CommandItem
        value={`${id}`}
        onSelect={() => {
          onSelect?.()
          // setOpen(false)
        }}
        className="cursor-pointer group"
      >
        <LazyLoadImage
          className="group-hover:animate-bounce"
          alt={lingui._(`pkm.name.${id}`)}
          width={64}
          height={64}
          src={getPokemonImageSrc(id)}
        />
        <span className="ml-2">{lingui._(`pkm.name.${id}`)}</span>
        <small className="ml-1 text-gray-500">{defaultFormNameDisplay}</small>
      </CommandItem>
    </Link>
  )
}
