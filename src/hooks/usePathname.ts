import { usePathname as usePathnameOri } from "next/navigation"
import { useLingui } from "@lingui/react"

export function usePathname() {
  const pathname = usePathnameOri()
  const lingui = useLingui()
  if (pathname.startsWith(`/${lingui.i18n.locale}`)) {
    return pathname.replace(`/${lingui.i18n.locale}`, "")
  }
  return pathname
}
