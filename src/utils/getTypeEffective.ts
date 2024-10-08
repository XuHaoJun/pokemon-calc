import { TYPE_ATTACK_RESITANCE } from "@/domain/constants"
import memoize from "memoizee"

export interface TypeEffectiveParams {
  offensiveType: string
  defensiveTypes: { name: string }[]
}

export function getTypeEffective({
  offensiveType,
  defensiveTypes,
}: TypeEffectiveParams): number {
  let typeEffective = 1
  for (const type of defensiveTypes) {
    typeEffective *= TYPE_ATTACK_RESITANCE[offensiveType][type.name]
  }
  return typeEffective
}

export const getTypeEffectiveMemo = memoize(getTypeEffective, {
  max: 100,
  normalizer: function (args) {
    return `${args[0].offensiveType}|${args[0].defensiveTypes.sort().map((x) => x.name).join(",")}`
  },
})
