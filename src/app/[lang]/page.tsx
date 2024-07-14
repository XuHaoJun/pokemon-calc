import { withLinguiPage } from "@/withLingui"
import { t, Trans } from "@lingui/macro"

import { Button } from "@/components/ui/button"
import { LangSwitcher } from "@/components/LangSwitcher"
import { Link } from "@/components/Link"

export default withLinguiPage(function Home() {
  return (
    <div>
      <Button>
        <Trans>Click me</Trans>
      </Button>
      <Link href="/type">test</Link>
    </div>
  )
})
