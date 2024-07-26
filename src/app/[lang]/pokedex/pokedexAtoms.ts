import { atom } from "jotai"
import { clone } from "remeda"

export type StatFielsName =
  | "hp"
  | "attack"
  | "defense"
  | "spAtk"
  | "spDef"
  | "speed"
  | "total"

export const defaultSiftFilter = {
  hp: { $gte: 1, $lte: 255 },
  attack: { $gte: 1, $lte: 255 },
  defense: { $gte: 1, $lte: 255 },
  spAtk: { $gte: 1, $lte: 255 },
  spDef: { $gte: 1, $lte: 255 },
  speed: { $gte: 1, $lte: 255 },
  total: { $gte: 1, $lte: 1125 },
}
export const siftFilterAtom = atom(clone(defaultSiftFilter))

export const defaultFlexsearchFilter = { name: "" }
export const flexsearchFilterAtom = atom(clone(defaultFlexsearchFilter))

export const allAtoms = [siftFilterAtom, flexsearchFilterAtom]
