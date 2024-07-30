"use client"

import * as React from "react"
import { getTypeBgColorClassName } from "@/utils/getTypeBgColorClassName"
import { useLingui } from "@lingui/react"

import { cn } from "@/lib/utils"
import { useLoadPokemonLingui } from "@/hooks/useLoadPokemonLingui"
import { MstSvIcon } from "./MstSvIcon"

export interface TypeBadgeProps {
  type: string
  className?: string
  showIcon?: boolean
}

export function TypeBadge({ className, type }: TypeBadgeProps) {
  useLoadPokemonLingui({ targets: ["type"] })
  const lingui = useLingui()

  return (
    <div
      className={`${cn(
        "p-1 text-sm font-bold text-white",
        getTypeBgColorClassName(type),
        className
      )} text-shadow`}
    >
      <MstSvIcon />
      <span>{lingui._(`pkm.type.${type}`)}</span>
    </div>
  )
}
