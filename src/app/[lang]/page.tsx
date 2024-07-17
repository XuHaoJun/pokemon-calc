import { redirect, RedirectType } from "next/navigation"
import { withLinguiPage } from "@/withLingui"

export default withLinguiPage(function Home({ lang }: any) {
  redirect(`/${lang}/type-calc`, RedirectType.replace)
  // TODO
  // add search history, news?
  // or keep it simple show screenshots and basic description
})
