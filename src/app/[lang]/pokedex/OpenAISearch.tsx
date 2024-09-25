import * as React from "react"
import { QueryKeys, useFetchPokemonMquery } from "@/api/query"
import { formatResponseError } from "@/utils/formatResponseError"
import { msg } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { useQueryClient } from "@tanstack/react-query"
import { Search } from "lucide-react"
import * as R from "remeda"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

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

  const sampleQuestions = React.useMemo(
    () => [
      msg`Fairy and Psychic dual-type with at least 125 Special Attack and 100 Special Defense, knowing Psychic or Moonblast.`,
      msg`Not a Fire-type, but can Flamethrower, Special Attack is at least 90, Speed is 80 or higher`,
      msg`Name contain "cat", Ability is "Intimidate"`,
    ],
    []
  )

  const queryClient = useQueryClient()

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
          disabled={query.isFetching}
        />
        <Button
          disabled={query.isFetching}
          onClick={() => {
            setEnableQuery(true)
            if ((query.error as any)?.status >= 400) {
              queryClient.invalidateQueries({
                queryKey: QueryKeys._useFetchPokemonMquery(),
              })
            }
          }}
        >
          {query.isFetching ? <LoadingSpinner /> : <Search />}
        </Button>
      </div>
      {query.error && (
        <div className="text-red-500">{formatResponseError(query.error)}</div>
      )}
      <div className="flex flex-wrap gap-1">
        {sampleQuestions.map((question, i) => (
          <Button
            key={`sampleQuestions[${i}]`}
            className="md:max-w-[50%] whitespace-normal"
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
