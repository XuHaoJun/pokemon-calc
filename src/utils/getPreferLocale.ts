import LinguiConfig from "../../lingui.config"

export function getPreferLocale(): string | null {
  if (typeof window !== "undefined" && window.navigator?.language) {
    const lang = window?.navigator?.language
    return (
      LinguiConfig.locales.find(
        (locale: string) =>
          lang.toLowerCase() === locale.toLowerCase() ||
          lang.toLowerCase().startsWith(locale.toLowerCase()) ||
          upgrade(lang).toLowerCase() === locale.toLowerCase()
      ) || null
    )
  }
  return null
}

function upgrade(l: string) {
  const subsets = {
    "zh-Hans": ["zh-CN", "zh-SG"],
    "zh-Hant": ["zh-TW", "zh-HK"],
  }
  for (const [superLang, subset] of Object.entries(subsets)) {
    if (subset.map((x) => x.toLowerCase()).includes(l.toLowerCase())) {
      return superLang
    }
  }
  return l
}
