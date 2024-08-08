export const getI18nIds = {
  pokemon: {
    name: (pkmId: number) => {
      return `pkm.name.${pkmId}`
    },
    defaultFormName: (pkmId: number) => {
      return `pkm.defaultFormName.${pkmId}`
    },
    type: (typeName: string) => {
      return `pkm.type.${typeName}`
    },
    ability: (abilityId: number) => {
      return `pkm.ability.${abilityId}`
    },
    abilityFlavorText: (abilityId: number) => {
      return `pkm.abilityFlavorText.${abilityId}`
    },
    move: (moveId: number) => {
      return `pkm.move.${moveId}`
    },
    moveFlavorText: (moveId: number) => {
      return `pkm.moveFlavorTexts.${moveId}`
    },
  },
}
