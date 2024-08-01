export interface BinaraySearchOptions<NF> {
  firstMiddle?: number
}

export function binaraySearch<T, TTarget, NF>(
  xs: T[],
  target: TTarget,
  compareFn: (target: TTarget, el: T) => number,
  options?: BinaraySearchOptions<NF>
): T | undefined {
  const { firstMiddle } = options ?? {}
  let m = 0
  let n = xs.length - 1
  while (m <= n) {
    const isFirstRun = m === 0 && n === xs.length - 1
    let mid: number
    if (
      isFirstRun &&
      typeof firstMiddle === "number" &&
      firstMiddle >= 0 &&
      firstMiddle < xs.length
    ) {
      mid = firstMiddle
    } else {
      mid = (n + m) >> 1
    }

    let current = xs[mid]
    let cmp = compareFn(target, current)
    if (cmp > 0) {
      m = mid + 1
    } else if (cmp < 0) {
      n = mid - 1
    } else {
      return current
    }
  }
  return undefined
}
