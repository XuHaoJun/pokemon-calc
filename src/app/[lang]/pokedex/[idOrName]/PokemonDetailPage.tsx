import Image from "next/image"
import { getPokemonImageSrc } from "@/utils/getPokemonImageSrc"
import { useLingui } from "@lingui/react"

export function PokemonDetailPage(props: any) {
  const { id } = props
  const lingui = useLingui()
  return (
    <div>
      <Image
        alt={lingui._(`pkm.name.${id}`)}
        width={64}
        height={64}
        src={getPokemonImageSrc(id)}
        priority
      />
      {lingui._(`pkm.name.${id}`)}
    </div>
  )
}
