import sift from "sift"
import { filter as uqry } from "uqry/full"

export function mysift(mongodbQuery: any) {
  const hasExpr = (obj: any): boolean => {
    if (obj?.hasOwnProperty("$expr")) return true
    if (typeof obj !== "object") return false
    for (const key of Object.keys(obj)) {
      if (hasExpr(obj[key])) return true
    }
    return false
  }
  if (hasExpr(mongodbQuery)) {
    return uqry(mongodbQuery)
  } else {
    return sift(mongodbQuery)
  }
}
