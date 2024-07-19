const mapping: Map<number, string> = new Map([
  [3, "ko"],
  [4, "zh-Hant"],
  [9, "en"],
  [11, "ja"],
  [12, "zh-Hans"],
])

export function getLocaleByPokeApiLangId(
  id: number,
  _notFoundValue?: null | string
) {
  const found = mapping.get(id)
  const notFoundValue = _notFoundValue !== undefined ? _notFoundValue : "en"
  if (!found) {
    return notFoundValue
  }
  return found
}
