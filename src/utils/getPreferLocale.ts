import LinguiConfig from "../../lingui.config"

export function getPreferLocale(): string | null {
  if (typeof window !== "undefined" && window.navigator?.language) {
    const lang = window?.navigator?.language
    return (
      LinguiConfig.locales.find(
        (locale: string) =>
          lang.toLowerCase() === locale.toLowerCase() ||
          lang.toLowerCase().startsWith(locale.toLowerCase())
      ) || null
    )
  }
  return null
}
