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

export function getTypeBgColorClassName(name: string) {
  return twBgColors[name] ?? ""
}
