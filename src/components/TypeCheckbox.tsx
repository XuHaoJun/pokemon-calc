"use client"

import * as React from "react"
import { getTypeBgColorClassName } from "@/utils/getTypeBgColorClassName"
import { useLingui } from "@lingui/react"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

import { buttonVariants } from "./ui/button"

export interface TypeCheckboxProps {
  type: string
  checked?: boolean
  onChange?: (nextChecked: boolean, type: string) => void
}

// TODO
// move to style?
const twBgColors: Record<string, string> = {
  normal: "bg-pkmtype-normal-1",
  fire: "bg-pkmtype-fire-1",
  water: "bg-pkmtype-water-1",
  electric: "bg-pkmtype-electric-1",
  grass: "bg-pkmtype-grass-1",
  ice: "bg-pkmtype-ice-1",
  fighting: "bg-pkmtype-fighting-1",
  poison: "bg-pkmtype-poison-1",
  ground: "bg-pkmtype-ground-1",
  flying: "bg-pkmtype-flying-1",
  psychic: "bg-pkmtype-psychic-1",
  bug: "bg-pkmtype-bug-1",
  rock: "bg-pkmtype-rock-1",
  ghost: "bg-pkmtype-ghost-1",
  dragon: "bg-pkmtype-dragon-1",
  dark: "bg-pkmtype-dark-1",
  steel: "bg-pkmtype-steel-1",
  fairy: "bg-pkmtype-fairy-1",
}

// TODO
// move to style?
const twCheckedBgColors: Record<string, string> = {
  normal: "data-[state=checked]:bg-pkmtype-normal-1",
  fire: "data-[state=checked]:bg-pkmtype-fire-1",
  water: "data-[state=checked]:bg-pkmtype-water-1",
  electric: "data-[state=checked]:bg-pkmtype-electric-1",
  grass: "data-[state=checked]:bg-pkmtype-grass-1",
  ice: "data-[state=checked]:bg-pkmtype-ice-1",
  fighting: "data-[state=checked]:bg-pkmtype-fighting-1",
  poison: "data-[state=checked]:bg-pkmtype-poison-1",
  ground: "data-[state=checked]:bg-pkmtype-ground-1",
  flying: "data-[state=checked]:bg-pkmtype-flying-1",
  psychic: "data-[state=checked]:bg-pkmtype-psychic-1",
  bug: "data-[state=checked]:bg-pkmtype-bug-1",
  rock: "data-[state=checked]:bg-pkmtype-rock-1",
  ghost: "data-[state=checked]:bg-pkmtype-ghost-1",
  dragon: "data-[state=checked]:bg-pkmtype-dragon-1",
  dark: "data-[state=checked]:bg-pkmtype-dark-1",
  steel: "data-[state=checked]:bg-pkmtype-steel-1",
  fairy: "data-[state=checked]:bg-pkmtype-fairy-1",
}

export function TypeCheckbox(props: TypeCheckboxProps) {
  const { type, onChange, checked } = props
  const [checkedState, setChecked] = React.useState<boolean>(
    props.checked ?? false
  )
  React.useEffect(() => {
    if (typeof checked === "boolean" && checkedState !== checked) {
      setChecked(checked)
    }
  }, [checkedState, checked])
  const toggleChecked = React.useCallback(() => {
    const nextCheckedState = !checkedState
    if (onChange) {
      onChange(nextCheckedState, type)
    } else {
      setChecked(!checkedState)
    }
  }, [checkedState, type, onChange])
  const dataState = React.useMemo(
    () => (checkedState ? "checked" : "unchecked"),
    [checkedState]
  )
  const lingui = useLingui()

  return (
    <div
      className={cn(
        buttonVariants({
          variant: "outline",
        }),
        "w-[140px] flex justify-start items-center space-x-2 cursor-pointer",
        twCheckedBgColors[props.type]
      )}
      data-state={dataState}
      onClick={toggleChecked}
    >
      <Checkbox
        checked={checkedState}
        className={cn(getTypeBgColorClassName(props.type))}
      />
      <label
        data-state={dataState}
        className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none data-[state=checked]:text-white data-[state=checked]:text-shadow"
      >
        {lingui._(`pkm.type.${type}`)}
      </label>
    </div>
  )
}
