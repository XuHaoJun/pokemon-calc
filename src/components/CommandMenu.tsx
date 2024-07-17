"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useFetchPokemonData } from "@/api/query"
import { msg, Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { DialogTitle } from "@radix-ui/react-dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export function CommandMenu({ ...props }: any) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

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

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  const lingui = useLingui()

  const query = useFetchPokemonData()

  const [searchText, setSearchText] = React.useState<string>("")

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
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Letters">
            <CommandItem>a</CommandItem>
            <CommandItem>b</CommandItem>
            <CommandSeparator />
            <CommandItem>c</CommandItem>
          </CommandGroup>

          <CommandItem>Apple</CommandItem>
        </CommandList>
        {/* <CommandList>
          <CommandEmpty>
            <Trans>No results found.</Trans>
          </CommandEmpty>
          <CommandGroup heading="Pokemon">
            <CommandItem key={554} value={`${554}`} onSelect={() => {}}>
              <img
                width={64}
                height={64}
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/554.png"
              />
              皮卡丘
            </CommandItem>
            <CommandItem key={555} value={`${555}`} onSelect={() => {}}>
              <img
                width={64}
                height={64}
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/555.png"
              />
              皮卡丘
            </CommandItem>
          </CommandGroup>
        </CommandList> */}
      </CommandDialog>
    </>
  )
}
