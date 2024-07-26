import type { Document } from "flexsearch"
import { atom } from "jotai"
import { loadable } from "jotai/utils"

export const flexsearchLibAsyncAtom = atom(async () => {
  const { default: FlexSearch } = await import("flexsearch")
  return FlexSearch
})
export const flexsearchLibAtom = loadable(flexsearchLibAsyncAtom)

export const flexsearchIsIndexingAtom = atom(true)

export const flexsearchAtom = atom<{ index: Document<unknown, false> | null }>({
  index: null,
})

export const flexsearchAtoms = [
  flexsearchLibAsyncAtom,
  flexsearchLibAtom,
  flexsearchIsIndexingAtom,
  flexsearchAtom,
]
