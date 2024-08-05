import * as React from "react"

import { cn } from "@/lib/utils"

export interface MstSvIconProps {
  type: string
  className?: string
}

const backgroundPositionMap: Record<string, string> = {
  // types
  normal: "0 0",
  fire: "0 -180px",
  water: "0 -200px",
  electric: "0 -240px",
  grass: "0 -220px",
  ice: "0 -280px",
  fighting: "0 -20px",
  poison: "0 -60px",
  ground: "0 -80px",
  flying: "0 -40px",
  psychic: "0 -260px",
  bug: "0 -120px",
  rock: "0 -100px",
  ghost: "0 -140px",
  dragon: "0 -300px",
  dark: "0 -320px",
  steel: "0 -160px",
  fairy: "0 -340px",
  // moves
  physical: "0 -360px",
  special: "0 -380px",
  status: "0 -400px",
}

export function MstSvIcon(props: MstSvIconProps) {
  const { type, className } = props
  return (
    <span
      className={cn(className, "w-[20px] h-[20px] inline-block align-middle")}
      style={{
        // TODO
        // import base path(/pokemon-calc)
        background: `url('/pokemon-calc/images/MST_SV.webp') no-repeat`,
        backgroundSize: "20px 420px",
        backgroundPosition: backgroundPositionMap[type],
      }}
    />
  )
}
