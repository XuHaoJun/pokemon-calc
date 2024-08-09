/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ["en", "zh-Hant", "zh-Hans", "ja", "ko"],
  sourceLocale: "en",
  fallbackLocales: {
    default: "en",
  },
  catalogs: [
    {
      path: "src/locales/{locale}",
      include: ["src/"],
    },
  ],
}
