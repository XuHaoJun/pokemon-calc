import { msg } from "@lingui/macro"

export const siteConfig = {
  name: msg`Pokemon Calc`,
  links: {
    github: "https://github.com/xuhaojun/pokemon-calc",
  },
}

export type SiteConfig = typeof siteConfig
