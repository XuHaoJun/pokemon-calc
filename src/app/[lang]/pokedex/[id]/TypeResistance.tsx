import { getTypeEffectiveMemo } from "@/utils/getTypeEffective"

import { TypeBadge } from "@/components/TypeBadge"

export interface TypeResistanceProps {
  offensiveType: string
  defensiveTypes: { name: string }[]
}

export function TypeDefensiveResistance({
  offensiveType,
  defensiveTypes,
}: TypeResistanceProps) {
  const effective = getTypeEffectiveMemo({ offensiveType, defensiveTypes })
  return (
    <div className="flex flex-col gap-1">
      <TypeBadge type={offensiveType} />
      <div>{effective}</div>
    </div>
  )
}
