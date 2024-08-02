import * as React from "react"
import { TYPE_COLORS } from "@/domain/constants"
import { getTypeBgColorClassName } from "@/utils/getTypeBgColorClassName"
import { useLingui } from "@lingui/react"
import { darken } from "color2k"

import { cn } from "@/lib/utils"

import { MstSvIcon } from "./MstSvIcon"

export interface TypeBadgeProps {
  type: string
  className?: string
  showIcon?: boolean
}

export function TypeBadge({
  className,
  type,
  showIcon = true,
}: TypeBadgeProps) {
  const lingui = useLingui()
  return (
    <div
      className={`${cn(
        "px-1 py-1 text-sm font-bold text-white rounded",
        getTypeBgColorClassName(type),
        className
      )} text-shadow`}
    >
      <div
        className="p-[2px] rounded"
        style={{ background: darken(TYPE_COLORS[type], 0.1) }}
      >
        {showIcon && <MstSvIcon type={type} className="mr-1" />}
        <span>{lingui._(`pkm.type.${type}`)}</span>
      </div>
    </div>
  )
}
