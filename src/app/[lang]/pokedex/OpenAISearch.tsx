import * as React from "react"
import { useFetchPokemonMquery } from "@/api/query"
import { msg, Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { Loader2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const OpenAISearch = () => {
  const i18n = useLingui()
  const [enableQuery, setEnableQuery] = React.useState(false)
  const [question, setQuestion] = React.useState("")
  const query = useFetchPokemonMquery(
    { question: question },
    { enabled: enableQuery }
  )
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <Input placeholder={i18n._(msg`你想找誰?`)} className="max-w-[300px]" />
        <Button disabled={query.isLoading} onClick={() => setEnableQuery(true)}>
          {query.isLoading ? <Loader2 /> : <Search />}
        </Button>
      </div>
      <div>
        <Button variant="outline" onClick={() => setEnableQuery(true)}>
          <Search className="mr-2 h-4 w-4" />
          <Trans>
            雙屬性：妖精和超能力，特攻至少125，特防至少100，要會精神強念或月亮之力。
          </Trans>
        </Button>
      </div>
    </div>
  )
}
