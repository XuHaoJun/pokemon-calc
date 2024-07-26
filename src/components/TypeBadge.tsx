"use client"

import * as React from "react"
import { getTypeBgColorClassName } from "@/utils/getTypeBgColorClassName"
import { useLingui } from "@lingui/react"

import { cn } from "@/lib/utils"
import { useLoadPokemonLingui } from "@/hooks/useLoadPokemonLingui"

export interface TypeBadgeProps {
  type: string
}

export function TypeBadge({ type }: TypeBadgeProps) {
  useLoadPokemonLingui({ targets: ["type"] })
  const lingui = useLingui()

  return (
    <div
      className={`${cn(
        "p-1 text-sm font-bold text-white",
        getTypeBgColorClassName(type)
      )} text-shadow`}
    >
      {lingui._(`pkm.type.${type}`)}
    </div>
  )
}
