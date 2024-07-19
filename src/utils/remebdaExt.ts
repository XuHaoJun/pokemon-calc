import * as R from "remeda"

export function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}

// TODO
// refactor it to correct type
export function isNullishOrEmpty(value: any): boolean {
  return R.isNullish(value) || R.isEmpty(value)
}


export function xBinarySearch() {
}