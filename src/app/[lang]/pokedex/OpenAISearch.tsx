import * as React from "react"
import { useFetchPokemonMquery } from "@/api/query"
import { msg } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { Loader2, Search } from "lucide-react"
import * as R from "remeda"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface OpenAISearchProps {
  mquery?: any
  onChange?: (mquery: any) => void
}

export const OpenAISearch = ({ mquery, onChange }: OpenAISearchProps) => {
  const i18n = useLingui()
  const [enableQuery, setEnableQuery] = React.useState(false)
  const [question, setQuestion] = React.useState("")
  const query = useFetchPokemonMquery(
    { question: question },
    { enabled: enableQuery && Boolean(question) }
  )
  React.useEffect(() => {
    if (query.isFetched) {
      if (query.error) {
        onChange?.(null)
      } else if (!R.isDeepEqual(mquery, query.data?.mquery)) {
        onChange?.(query.data?.mquery)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, query.error, query.isFetched])

  const sampleQuestions = [
    msg`Fairy and Psychic dual-type with at least 125 Special Attack and 100 Special Defense, knowing Psychic or Moonblast.`,
    msg`Not a Fire-type, but can Flamethrower, Special Attack is at least 90, Speed is 80 or higher`
  ]

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <Input
          type="search"
          placeholder={i18n._(msg`Find pokemons by question...`)}
          className="md:max-w-[40%]"
          value={question}
          onChange={(e) => {
            setEnableQuery(false)
            setQuestion(e.target.value)
            if (!Boolean(e.target.value)) {
              onChange?.(null)
            }
          }}
          disabled={query.isLoading}
        />
        <Button disabled={query.isLoading} onClick={() => setEnableQuery(true)}>
          {query.isLoading ? <Loader2 /> : <Search />}
        </Button>
      </div>
      <div className="flex gap-1">
        {sampleQuestions.map((question, i) => (
          <Button
            key={`sampleQuestions[${i}]`}
            variant="outline"
            onClick={() => {
              setEnableQuery(true)
              setQuestion(i18n._(question))
            }}
          >
            <Search className="mr-2 h-4 w-4" />
            {i18n._(question)}
          </Button>
        ))}
      </div>
    </div>
  )
}
