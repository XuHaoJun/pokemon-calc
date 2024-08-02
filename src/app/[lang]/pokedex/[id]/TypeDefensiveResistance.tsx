import { getTypeEffectiveMemo } from "@/utils/getTypeEffective"

import { cn } from "@/lib/utils"
import { TypeBadge } from "@/components/TypeBadge"

export interface TypeDefensiveResistance {
  offensiveType: string
  defensiveTypes: { name: string }[]
}

const effectiveBgColors: Record<number, string> = {
  4: "bg-red-800",
  2: "bg-red-400",
  1: "bg-gray-400 dark:bg-background",
  0: "bg-black dark:bg-gray-400",
  0.5: "bg-green-800",
  0.25: "bg-green-400",
}

export function TypeDefensiveResistance({
  offensiveType,
  defensiveTypes,
}: TypeDefensiveResistance) {
  const effective = getTypeEffectiveMemo({ offensiveType, defensiveTypes })
  return (
    <div className="flex flex-col gap-1">
      <TypeBadge type={offensiveType} />
      <div
        className={`${cn("text-lg font-bold w-full md:rounded text-white", effectiveBgColors[effective])} text-shadow flex justify-center items-center`}
      >
        {effective}
      </div>
    </div>
  )
}
