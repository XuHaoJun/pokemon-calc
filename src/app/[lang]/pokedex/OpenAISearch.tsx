"use client"

import * as React from "react"
import { QueryKeys, useFetchPokemonMquery } from "@/api/query"
import { formatResponseError } from "@/utils/formatResponseError"
import { msg, Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { useQueryClient } from "@tanstack/react-query"
import { Edit, Search } from "lucide-react"
import * as R from "remeda"
import sift from "sift"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { JsonEditor } from "@/components/JsonEditor"
import { Textarea2 } from "@/components/Textarea2"

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

  const siftError = React.useMemo<any>(() => {
    if (query.data?.mquery) {
      try {
        sift(query.data?.mquery)
      } catch (error) {
        return error
      }
    }
    return null
  }, [query.data?.mquery])

  React.useEffect(() => {
    if (query.isFetched) {
      if (query.error || siftError) {
        onChange?.(null)
      } else if (!R.isDeepEqual(mquery, query.data?.mquery)) {
        onChange?.(query.data?.mquery)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, query.error, query.isFetched, siftError])

  const sampleQuestions = React.useMemo(
    () => [
      msg`Fairy and Psychic dual-type with at least 125 Special Attack and 100 Special Defense, knowing Psychic or Moonblast.`,
      msg`Not a Fire-type, but can Flamethrower, Special Attack is at least 90, Speed is 80 or higher`,
      msg`Name contain "cat", Ability is "Intimidate"`,
      msg`Have type resistance to fire, grass, fairy, fighting types, and have move that is ground type and special attack power is 70 or higher`,
      msg`No weaknesses to Fire, Grass, or Ice types, a speed stat of 100 or higher, and learn any Fighting-type move through leveling up`,
    ],
    []
  )

  const queryClient = useQueryClient()

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-1 justify-center">
          <div className="flex flex-col gap-1 min-w-[100%] md:min-w-[40%] rounded-md border p-3 border-gray-300 focus-within:border-gray-500">
            <Textarea2
              autoFocus
              className="border-none focus:outline-none resize-none"
              autoComplete="off"
              minRows={2}
              placeholder={i18n._(msg`Find pokemons by question...`)}
              value={question}
              onChange={(e: { target: { value: React.SetStateAction<string> } }) => {
                setEnableQuery(false)
                setQuestion(e.target.value)
                if (!Boolean(e.target.value)) {
                  onChange?.(null)
                }
              }}
              disabled={query.isFetching}
            />
            <div className="flex gap-1 mt-2 items-end">
              {mquery && (
                <EditButton
                  query={query}
                  mquery={mquery}
                  onChangeMquery={(nextMquery: any) => onChange?.(nextMquery)}
                />
              )}
              <div className="flex-1" />
              <Button
                size={"icon"}
                disabled={query.isFetching || !Boolean(question)}
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
          </div>
        </div>
        {query.error && (
          <div className="text-red-500">{formatResponseError(query.error)}</div>
        )}
        {!query.error && siftError && (
          <div className="text-red-500">can not find pokemon</div>
        )}
        <div className="flex flex-wrap gap-3">
          {sampleQuestions.map((question, i) => (
            <Button
              key={`sampleQuestions[${i}]`}
              className="md:max-w-[50%] whitespace-normal"
              variant="outline"
              onClick={() => {
                setEnableQuery(true)
                setQuestion(i18n._(question))
              }}
              disabled={query.isFetching}
            >
              <Search className="mr-2 h-4 w-4" />
              {i18n._(question)}
            </Button>
          ))}
        </div>
      </div>
    </>
  )
}

type DynamicObject = {
  [key: string]: any
}

type Mquery = DynamicObject | null

function EditButton({
  query,
  mquery,
  onChangeMquery,
}: {
  query: any
  mquery: Mquery
  onChangeMquery?: (mquery: Mquery) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [mqueryEdit, setMqueryEdit] = React.useState<Mquery>(R.clone(mquery))
  React.useEffect(() => {
    if (open && !R.isDeepEqual(mquery, mqueryEdit)) {
      setMqueryEdit(R.clone(mquery))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mquery])
  const isChanged = React.useMemo(
    () => !R.isDeepEqual(mquery, mqueryEdit),
    [mquery, mqueryEdit]
  )
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size={"smIcon"} variant="outline" disabled={query.isFetching}>
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[600px]"
        onInteractOutside={(e) => {
          if (isChanged) {
            e.preventDefault()
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            <Trans>Edit MongoDB query</Trans>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          {mqueryEdit && (
            <JsonEditor
              className="max-h-[80vh] overflow-auto"
              data={mqueryEdit}
              setData={(nextData) => {
                setMqueryEdit(nextData as Mquery)
              }}
            />
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={R.isDeepEqual(query.data?.mquery, mquery)}
            onClick={() => {
              setOpen(false)
              onChangeMquery?.(query.data?.mquery)
            }}
          >
            <Trans>Reset</Trans>
          </Button>
          <Button
            disabled={!isChanged}
            onClick={() => {
              setOpen(false)
              onChangeMquery?.(mqueryEdit)
            }}
          >
            <Trans>Save</Trans>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
