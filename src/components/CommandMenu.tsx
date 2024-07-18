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
import type { Document } from "flexsearch"
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

  const lingui = useLingui()
  const flexsearchRef = React.useRef<{
    index: Document<any> | null
    loadedLocales: Set<string>
  }>({
    index: null,
    loadedLocales: new Set(),
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
            field: [
              "en_name",
              "zh-Hant_name",
              "zh-Hans_name",
              "ja_name",
              "ko_name",
            ],
          },
        })
      flexsearchRef.current.index = index

      if (
        query.data &&
        !flexsearchRef.current.loadedLocales.has(lingui.i18n.locale)
      ) {
        for (const x of query.data.data.pokemon_v2_pokemon) {
          const names: Record<string, string> = {}
          for (const nameInfo of x.pokemon_v2_pokemonspecy
            .pokemon_v2_pokemonspeciesnames) {
            const locale = getLocaleByPokeApiLangId(nameInfo.language_id, null)
            // load current locale and en
            if ((locale && locale === lingui.i18n.locale) || locale === "en") {
              flexsearchRef.current.loadedLocales.add(locale)
              names[`${locale}_name`] = nameInfo.name
            }
          }
          index.add({ id: x.id, ...names })
        }
      }
    }
    if (query.data) {
      doSearchIndex()
    }
  }, [query.data, lingui.i18n.locale])

  React.useEffect(() => {
    const { index } = flexsearchRef.current
    if (index && debouncedSearchText) {
      console.log(index.search(debouncedSearchText))
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
      <CommandDialog open={open} onOpenChange={setOpen}>
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
            <Trans>No results found.</Trans>
          </CommandEmpty>
          {Boolean(searchText) === false && (
            <CommandGroup heading="Random Pokemons">
              {randomPokemonIds.map((id) => (
                <Link key={id} href={`/pokedex/${id}`}>
                  <CommandItem
                    value={`${id}`}
                    onSelect={() => {
                      setOpen(false)
                    }}
                    className="cursor-pointer"
                  >
                    <LazyLoadImage
                      alt={"test"}
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
  return [getRandomInt(1, 1025), getRandomInt(1, 1025), getRandomInt(1, 1025)]
}
