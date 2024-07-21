"use client"

import * as React from "react"
import { useFetchPokemonData } from "@/api/query"
import { getLocaleByPokeApiLangId } from "@/utils/getLocaleByPokeApiLangId"
import { getPokemonImageSrc } from "@/utils/getPokemonImageSrc"
import { getRandomInt } from "@/utils/remebdaExt"
import { msg, Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { DialogTitle } from "@radix-ui/react-dialog"
import { useDebounce } from "ahooks"
import type { Document, SimpleDocumentSearchResultSetUnit } from "flexsearch"
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

  const query = useFetchPokemonData()

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
  const flexsearchRef = React.useRef<{
    index: Document<any> | null
  }>({
    index: null,
  })
  React.useEffect(() => {
    async function doSearchIndex() {
      const FlexSearch = (await import("flexsearch")).default
      const index =
        flexsearchRef.current.index ||
        new FlexSearch.Document({
          encode: false,
          tokenize: "full",
          document: {
            id: "id",
            // why mutiple lanague?
            // i want support current locale and en toghter
            tag: "tag",
            index: [
              "names:en",
              "names:zh-Hant",
              "names:zh-Hans",
              "names:ja",
              "names:ko",
            ],
          },
        })
      flexsearchRef.current.index = index

      if (query.data) {
        for (const x of query.data.data.pokemon_v2_pokemon) {
          const names: Record<string, string> = {}
          for (const nameInfo of x.pokemon_v2_pokemonspecy
            .pokemon_v2_pokemonspeciesnames) {
            const locale = getLocaleByPokeApiLangId(nameInfo.language_id, null)
            if ((locale && locale === lingui.i18n.locale) || locale === "en") {
              names[locale] = nameInfo.name
            }
          }
          const nextDoc = { id: x.id, tag: "pokemon", names }
          index.addAsync(x.id, nextDoc)
        }
      }
    }
    if (query.data) {
      doSearchIndex()
    }
  }, [query.data, lingui.i18n.locale])

  React.useEffect(() => {
    const { index } = flexsearchRef.current
    if (index) {
      const nextSearchResult = index.search(debouncedSearchText)
      setSearchResult(nextSearchResult)
    }
  }, [debouncedSearchText])

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
          {Boolean(searchResult.length) && (
            <CommandGroup heading="Pokemons">
              {searchResult
                .flatMap((x) => x.result)
                .map((id) => (
                  <Link key={id} href={`/pokedex/${id}`}>
                    <CommandItem
                      value={`${id}`}
                      onSelect={() => {
                        setOpen(false)
                      }}
                      className="cursor-pointer group"
                    >
                      <LazyLoadImage
                        className="group-hover:animate-bounce"
                        alt={lingui._(`pkm.name.${id}`)}
                        width={64}
                        height={64}
                        src={getPokemonImageSrc(id as number)}
                      />
                      {lingui._(`pkm.name.${id}`)}
                    </CommandItem>
                  </Link>
                ))}
            </CommandGroup>
          )}
          {Boolean(searchText) === false &&
            openAndSearched === false &&
            open && (
              <CommandGroup heading="Random Pokemons">
                {randomPokemonIds.map((id) => (
                  <Link key={id} href={`/pokedex/${id}`}>
                    <CommandItem
                      value={`${id}`}
                      onSelect={() => {
                        setOpen(false)
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
                      {lingui._(`pkm.name.${id}`)}
                    </CommandItem>
                  </Link>
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
