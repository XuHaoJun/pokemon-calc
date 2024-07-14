import urlLib from "url"
import type { UrlObject } from "url"
import { useLingui } from "@lingui/react"
import urlJoin from "url-join"

type Url = string | UrlObject

export type LocalePathFunc<T extends Url> = (url: T) => T

export function useLocalePath() {
  const lingui = useLingui()
  return {
    localePath: function (url: Url) {
      if (typeof url === "string") {
        return urlJoin('/', lingui.i18n.locale, url)
      } else {
        const withLocaleUrl = new urlLib.URL(url)
        withLocaleUrl.pathname = urlJoin(
          '/',
          lingui.i18n.locale,
          withLocaleUrl.pathname
        )
        return withLocaleUrl
      }
    },
  }
}
