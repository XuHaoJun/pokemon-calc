"use client"

import * as React from "react"
import { useFetchPokemonData } from "@/api/query"
import { flexsearchAtom } from "@/atoms"
import { getPokemonImageSrc } from "@/utils/getPokemonImageSrc"
import { toPokemon2 } from "@/utils/toPokemon2"
import { msg, Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { useDebounce } from "ahooks"
import type { SimpleDocumentSearchResultSetUnit } from "flexsearch"
import { useAtom } from "jotai"
import { ExternalLinkIcon, X } from "lucide-react"
import { unstable_batchedUpdates } from "react-dom"
import { TypeAnimation } from "react-type-animation"
import * as R from "remeda"

import { useLoadPokemonLingui } from "@/hooks/useLoadPokemonLingui"
import { Button } from "@/components/ui/button"
import { Command, CommandInput, CommandList } from "@/components/ui/command"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Link } from "@/components/Link"
import {
  PokemonCommandItem,
  PokemonCommandItemSelected,
} from "@/components/pokemon/PokemonCommandItem"

const SHOW_ANIMATION_TIME = 2000

const INIT_SEED = new Date()

export function WhosThatPokemonPage() {
  const { isPkmLinguiLoaded } = useLoadPokemonLingui({
    targets: ["name"],
  })

  const query = useFetchPokemonData()

  const [randomSeed, setRandomSeed] = React.useState(INIT_SEED)

  const lingui = useLingui()
  const randomPokemon = React.useMemo(
    () =>
      query.data && randomSeed && isPkmLinguiLoaded
        ? (() => {
            const sampled = R.sample(query.data?.data.pokemon_v2_pokemon, 1)[0]
            if (sampled) {
              return toPokemon2({
                pokemon: sampled,
                pokemon_v2_ability: query.data.data.pokemon_v2_ability,
                pokemon_v2_type: query.data.data.pokemon_v2_type,
                pokemon_v2_move: query.data.data.pokemon_v2_move,
                pokemon_v2_evolutionchain:
                  query.data.data.pokemon_v2_evolutionchain,
                t: lingui._,
              })
            }
            return null
          })()
        : null,
    [lingui._, query.data, randomSeed, isPkmLinguiLoaded]
  )

  const canvasResultRef = React.useRef<CanvasWithImageData | null>(null)

  const [isCanvasFirstUpdated, setIsCanvasFirstUpdated] =
    React.useState<boolean>(false)
  const updateCanvas = React.useCallback(async () => {
    if (!randomPokemon) {
      return
    }
    const result = await replaceNonTransparentPixelsWithBlack(
      getPokemonImageSrc(randomPokemon.id)
    )
    canvasResultRef.current = result
    result.canvas.setAttribute("style", "width: 300px; height: 300px;")
    const canvasContainer = document.querySelector("#canvas-container")
    if (canvasContainer) {
      canvasContainer.replaceChildren()
      canvasContainer.appendChild(result.canvas)
      if (!isCanvasFirstUpdated) {
        setIsCanvasFirstUpdated(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomPokemon])

  React.useEffect(() => {
    updateCanvas()
  }, [updateCanvas])

  const [showAnswer, setShowAnswer] = React.useState(false)
  React.useEffect(() => {
    if (showAnswer && canvasResultRef.current) {
      showAnswerImage(
        canvasResultRef.current.context,
        canvasResultRef.current.originalImageData
      )
    } else {
      updateCanvas()
    }
  }, [showAnswer, updateCanvas])

  const [searchText, setSearchText] = React.useState<string>("")
  const debouncedSearchText = useDebounce(searchText, {
    wait: 250,
    maxWait: 250 * 3,
  })
  const [isSearching, setIsSearching] = React.useState(false)
  const [searchResult, setSearchResult] = React.useState<
    SimpleDocumentSearchResultSetUnit[]
  >([])
  const [{ index: flexsearchIndex }] = useAtom(flexsearchAtom)

  const [ansewerPokemon, setAnsewerPokemon] =
    React.useState<PokemonCommandItemSelected | null>(null)

  React.useEffect(() => {
    async function run() {
      if (flexsearchIndex) {
        unstable_batchedUpdates(async () => {
          setIsSearching(true)
          const nextSearchResult =
            await flexsearchIndex.searchAsync(debouncedSearchText)
          setSearchResult(nextSearchResult)
          setIsSearching(false)
        })
      }
    }
    run()
  }, [debouncedSearchText, ansewerPokemon, flexsearchIndex])

  React.useEffect(() => {
    if (ansewerPokemon) {
      const answerSearchText = getSearchTextByPkm(ansewerPokemon)
      if (searchText !== answerSearchText) {
        unstable_batchedUpdates(() => {
          setShowWrongResult(false)
          setAnsewerPokemon(null)
        })
      }
    }
  }, [searchText, ansewerPokemon])

  const handlePokemonSelect = (selected: PokemonCommandItemSelected) => {
    unstable_batchedUpdates(() => {
      setAnsewerPokemon(selected)
      const nextSearchText = getSearchTextByPkm(selected)
      setSearchText(nextSearchText)
    })
  }

  const isPass = React.useMemo<boolean>(() => {
    if (R.isNullish(randomPokemon) || R.isNullish(ansewerPokemon)) {
      return false
    } else {
      return randomPokemon.id === ansewerPokemon.id
    }
  }, [ansewerPokemon, randomPokemon])

  const [showWrongResult, setShowWrongResult] = React.useState<boolean>(false)
  const handleSubmit = () => {
    if (isPass) {
      setShowAnswer(true)
    } else {
      setShowWrongResult(true)
    }
  }

  const handleHint = () => {
    if (canvasResultRef.current) {
      showHintImage(
        canvasResultRef.current.imageData,
        canvasResultRef.current.context,
        canvasResultRef.current.originalImageData
      )
    }
  }

  const submitDisabled = React.useMemo(() => {
    return R.isNullish(ansewerPokemon) || isPass
  }, [ansewerPokemon, isPass])

  return (
    <div className="md:container flex flex-col gap-2 py-6">
      <div className="flex flex-col justify-center items-center">
        {isCanvasFirstUpdated === false && (
          <Skeleton className="h-[300px] w-[300px] rounded-xl" />
        )}
        <div id="canvas-container"></div>
        {showAnswer && randomPokemon ? (
          <div className="py-2 flex justify-center items-center">
            <PkmTypeAnimation
              id={randomPokemon.id}
              nameDisplay={randomPokemon.nameDisplay}
              defaultFormNameDisplay={randomPokemon.defaultFormNameDisplay}
            />
          </div>
        ) : (
          <div className="text-4xl invisible py-2">placeholder</div>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" onClick={handleHint}>
              <Trans>Hint</Trans>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              <Trans>Show partial original image</Trans>
            </p>
          </TooltipContent>
        </Tooltip>
        <Button
          variant="secondary"
          onClick={() => {
            unstable_batchedUpdates(() => {
              setRandomSeed(new Date())
              setSearchText("")
              setSearchResult([])
              setAnsewerPokemon(null)
              setShowAnswer(false)
              setShowWrongResult(false)
            })
          }}
        >
          <Trans>Random</Trans>
        </Button>
        <Button variant="secondary" onClick={() => setShowAnswer(!showAnswer)}>
          {showAnswer ? <Trans>Hide Answer</Trans> : <Trans>Show Answer</Trans>}
        </Button>
      </div>
      <div className="flex justify-center items-baseline">
        <Command
          className="rounded-lg border shadow-md md:max-w-[450px] relative"
          shouldFilter={false}
        >
          <CommandInput
            value={searchText}
            onValueChange={setSearchText}
            placeholder={lingui._(msg`Who's That Pokémon?`)}
          />
          <CommandList>
            {!ansewerPokemon && searchText
              ? searchResult
                  .flatMap((x) => x.result)
                  .map((id) => (
                    <PokemonCommandItem
                      key={id}
                      id={id as number}
                      showImage={false}
                      wrapLink={false}
                      onSelect={handlePokemonSelect}
                    />
                  ))
              : null}
          </CommandList>
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={() => {
              unstable_batchedUpdates(() => {
                setSearchText("")
                setSearchResult([])
                setAnsewerPokemon(null)
                setShowWrongResult(false)
              })
            }}
            disabled={isPass !== null ? isPass : false}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </Command>
        <Tooltip open={showWrongResult}>
          <TooltipTrigger asChild>
            <Button
              className="ml-2"
              onClick={handleSubmit}
            >
              <Trans>Submit</Trans>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              <Trans>Wrong!</Trans>
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

function PkmTypeAnimation({
  id,
  nameDisplay,
  defaultFormNameDisplay,
}: {
  id: number
  nameDisplay: string
  defaultFormNameDisplay: string
}) {
  const ref = React.useRef<HTMLSpanElement | null>(null)
  const [nameDisplayDone, setNameDisplayDone] = React.useState(false)
  const [defaultFormNameDisplayDone, setDefaultFormNameDisplayDone] =
    React.useState(defaultFormNameDisplay === "" ? true : false)
  const href = `/pokedex/${id}`
  return (
    <>
      <TypeAnimation
        ref={ref}
        sequence={[
          500,
          nameDisplay,
          () => {
            if (ref.current) {
              ref.current.className =
                "scroll-m-20 text-4xl font-bold tracking-tight"
            }
            setNameDisplayDone(true)
          },
        ]}
        cursor
        speed={1}
        wrapper="span"
        repeat={0}
        className="scroll-m-20 text-4xl font-bold tracking-tight ml-2"
      />
      {defaultFormNameDisplay && nameDisplayDone && (
        <TypeAnimation
          sequence={[
            defaultFormNameDisplay,
            () => setDefaultFormNameDisplayDone(true),
          ]}
          cursor={false}
          speed={1}
          wrapper="span"
          repeat={0}
          className="text-base text-muted-foreground pl-2"
        />
      )}
      {nameDisplayDone && defaultFormNameDisplayDone && (
        <Link href={href} target="_blank">
          <Button variant="outline" size="sm" className="ml-2">
            <ExternalLinkIcon className="h-3 w-3" />
          </Button>
        </Link>
      )}
    </>
  )
}

interface CanvasWithImageData {
  canvas: HTMLCanvasElement
  image: HTMLImageElement
  originalImageData: ImageData
  imageData: ImageData
  context: CanvasRenderingContext2D
}

function replaceNonTransparentPixelsWithBlack(
  imageSrc: string
): Promise<CanvasWithImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "Anonymous"
    img.src = imageSrc
    img.onload = function () {
      // Create a canvas and set its dimensions to the image's dimensions
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d", { willReadFrequently: true })
      if (!ctx) {
        reject(new Error("Failed to get 2d context"))
        return
      }
      canvas.width = img.width
      canvas.height = img.height

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0)

      // Get the image data
      const originalImageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      )

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Iterate through each pixel (each pixel is represented by 4 consecutive values in the data array: R, G, B, A)
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3] // Alpha channel

        // If the pixel is not transparent, replace the color with black
        if (alpha !== 0) {
          data[i] = 0 // Red
          data[i + 1] = 0 // Green
          data[i + 2] = 0 // Blue
        }
      }

      // Put the modified image data back onto the canvas
      ctx.putImageData(imageData, 0, 0)

      // Convert the canvas to an image (or use the canvas as needed)
      // const blackedImageSrc = canvas.toDataURL()
      return resolve({
        canvas,
        image: img,
        originalImageData,
        context: ctx,
        imageData: imageData,
      })
    }
  })
}

function showAnswerImage(ctx: any, originalImageData: any) {
  const data = originalImageData.data
  const width = originalImageData.width
  const height = originalImageData.height

  let currentLine = 0
  const totalLines = height

  const interval = setInterval(() => {
    if (currentLine < totalLines) {
      for (let x = 0; x < width; x++) {
        const index = (currentLine * width + x) * 4

        // Restore original pixel color
        ctx.putImageData(originalImageData, 0, 0, x, currentLine, 1, 1)
      }
      currentLine++
    } else {
      clearInterval(interval)
    }
  }, SHOW_ANIMATION_TIME / height) // Duration divided by the number of lines
}

function showHintImage(imageData: any, ctx: any, originalImageData: any) {
  const data = imageData.data
  const originalData = originalImageData.data
  const width = imageData.width
  const height = imageData.height

  const rectWidth = 10
  const rectHeight = 10

  let foundValidRectangle = false
  let attempts = 0

  while (!foundValidRectangle && attempts < 1000) {
    attempts++

    const randomPixelIndex = Math.floor(Math.random() * (width * height))
    const x = randomPixelIndex % width
    const y = Math.floor(randomPixelIndex / width)

    const topLeftIndex = (y * width + x) * 4
    const topRightX = x + rectWidth - 1
    const topRightY = y
    const bottomLeftX = x
    const bottomLeftY = y + rectHeight - 1
    const bottomRightX = x + rectWidth - 1
    const bottomRightY = y + rectHeight - 1

    if (topRightX < width && bottomRightY < height) {
      const topRightIndex = (topRightY * width + topRightX) * 4
      const bottomLeftIndex = (bottomLeftY * width + bottomLeftX) * 4
      const bottomRightIndex = (bottomRightY * width + bottomRightX) * 4

      const topLeftAlpha = data[topLeftIndex + 3]
      const topRightAlpha = data[topRightIndex + 3]
      const bottomLeftAlpha = data[bottomLeftIndex + 3]
      const bottomRightAlpha = data[bottomRightIndex + 3]

      if (
        topLeftAlpha !== 0 &&
        topRightAlpha !== 0 &&
        bottomLeftAlpha !== 0 &&
        bottomRightAlpha !== 0
      ) {
        foundValidRectangle = true

        for (let i = 0; i < rectHeight; i++) {
          for (let j = 0; j < rectWidth; j++) {
            const pixelX = x + j
            const pixelY = y + i
            const pixelIndex = (pixelY * width + pixelX) * 4

            // Get original pixel color from originalImageData
            data[pixelIndex] = Math.floor(originalData[pixelIndex])
            data[pixelIndex + 1] = Math.floor(originalData[pixelIndex + 1])
            data[pixelIndex + 2] = Math.floor(originalData[pixelIndex + 2])
          }
        }

        ctx.putImageData(imageData, 0, 0)
      }
    }
  }
}

function getSearchTextByPkm(selected: PokemonCommandItemSelected) {
  return (
    selected.nameDisplay +
    (selected.defaultFormNameDisplay ? " " : "") +
    selected.defaultFormNameDisplay
  )
}
