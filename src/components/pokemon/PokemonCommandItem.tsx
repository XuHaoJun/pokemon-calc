import { getPokemonImageSrc } from "@/utils/getPokemonImageSrc"
import { useLingui } from "@lingui/react"
import { LazyLoadImage } from "react-lazy-load-image-component"

import { CommandItem } from "@/components/ui/command"

import { Link } from "../Link"

export interface PokemonCommandItemSelected {
  id: number
  nameDisplay: string
  defaultFormNameDisplay: string
}

export function PokemonCommandItem({
  id,
  showImage = true,
  wrapLink = true,
  onSelect,
}: {
  id: number
  showImage: boolean
  wrapLink?: boolean
  onSelect?: (selected: PokemonCommandItemSelected) => void
}) {
  const lingui = useLingui()
  const nameDisplay = lingui._(`pkm.name.${id}`)
  const defaultFormNameDisplay =
    lingui._(`pkm.defaultFormName.${id}`) === `pkm.defaultFormName.${id}`
      ? ""
      : lingui._(`pkm.defaultFormName.${id}`)
  const renderItem = () => (
    <CommandItem
      value={`${id}`}
      onSelect={() => {
        onSelect?.({ id, nameDisplay, defaultFormNameDisplay })
      }}
      className="cursor-pointer group"
    >
      {showImage && (
        <LazyLoadImage
          className="group-hover:animate-bounce"
          alt={nameDisplay}
          width={64}
          height={64}
          src={getPokemonImageSrc(id)}
        />
      )}
      <span className="ml-2">{nameDisplay}</span>
      <small className="ml-1 text-muted-foreground">
        {defaultFormNameDisplay}
      </small>
    </CommandItem>
  )
  if (wrapLink) {
    return (
      <Link key={id} href={`/pokedex/${id}`}>
        {renderItem()}
      </Link>
    )
  }
  return renderItem()
}
