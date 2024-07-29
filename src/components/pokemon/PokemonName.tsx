import * as React from "react"
import type { Pokemon } from "@/domain/pokemon"
import { useLingui } from "@lingui/react"

import { cn } from "@/lib/utils"

export interface PokemonNameProps {
  className?: string
  pokemon: Pokemon
  nameComponent?: "h1" | "span"
}

export function PokemonName({
  className,
  pokemon,
  nameComponent = "span",
}: PokemonNameProps) {
  const lingui = useLingui()
  const { id } = pokemon
  const defaultFormNameI18nId = `pkm.defaultFormName.${id}`
  const defaultFormName = lingui._(defaultFormNameI18nId)
  const NameComponent = nameComponent
  return (
    <div className="flex items-center">
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">
        {lingui._(`pkm.name.${id}`)}
      </h1>
      <span>
        {lingui._(`pkm.defaultFormName.${id}`) === `pkm.defaultFormName.${id}`
          ? ""
          : "-" + lingui._(`pkm.defaultFormName.${id}`)}
      </span>
    </div>
  )
}
