"use client"

import * as React from "react"
import NextImage from "next/image"
import { useFetchPokemonData } from "@/api/query"
import { getI18nIds } from "@/utils/getI18nIds"
import { getPokemonImageSrc } from "@/utils/getPokemonImageSrc"
import { toPokemon2 } from "@/utils/toPokemon2"
import { Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { TypeAnimation } from "react-type-animation"
import * as R from "remeda"

import { useLoadPokemonLingui } from "@/hooks/useLoadPokemonLingui"
import { Button } from "@/components/ui/button"

const SHOW_ANIMATION_TIME = 2000

export function WhosThatPokemonPage() {
  useLoadPokemonLingui({ targets: ["name"] })

  const query = useFetchPokemonData()

  const [randomSeed, setRandomSeed] = React.useState(new Date())

  const lingui = useLingui()
  const randomPokemon = React.useMemo(
    () =>
      query.data && randomSeed
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
    [lingui._, query.data, randomSeed]
  )

  const canvasResultRef = React.useRef<CanvasWithImageData | null>(null)

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
    }
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

  return (
    <div className="md:container flex flex-col gap-2 py-6">
      <div className="flex flex-col justify-center items-center">
        <div id="canvas-container"></div>
        {showAnswer && randomPokemon ? (
          <div className="py-2 flex justify-center items-center">
            <PkmTypeAnimation
              nameDisplay={randomPokemon.nameDisplay}
              defaultFormNameDisplay={randomPokemon.defaultFormNameDisplay}
            />
          </div>
        ) : (
          <div className="text-4xl invisible py-2">placeholder</div>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            if (canvasResultRef.current) {
              showHintImage(
                canvasResultRef.current.imageData,
                canvasResultRef.current.context,
                canvasResultRef.current.originalImageData
              )
            }
          }}
        >
          Hint
        </Button>
        <Button
          onClick={() => {
            setRandomSeed(new Date())
            if (showAnswer) {
              setShowAnswer(false)
            }
          }}
        >
          Random
        </Button>
        <Button onClick={() => setShowAnswer(!showAnswer)}>
          {showAnswer ? <Trans>Hide Answer</Trans> : <Trans>Show Answer</Trans>}
        </Button>
      </div>
    </div>
  )
}

function PkmTypeAnimation({
  nameDisplay,
  defaultFormNameDisplay,
}: {
  nameDisplay: string
  defaultFormNameDisplay: string
}) {
  const ref = React.useRef<HTMLSpanElement | null>(null)
  const [nameDisplayDone, setNameDisplayDone] = React.useState(false)
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
        className="scroll-m-20 text-4xl font-bold tracking-tight"
      />
      {defaultFormNameDisplay && nameDisplayDone && (
        <TypeAnimation
          sequence={[defaultFormNameDisplay]}
          cursor={false}
          speed={1}
          wrapper="span"
          repeat={0}
          className="text-base text-muted-foreground pl-2"
        />
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
      const ctx = canvas.getContext("2d")
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
            data[pixelIndex + 1] = Math.floor(
              originalData[pixelIndex + 1] 
            )
            data[pixelIndex + 2] = Math.floor(
              originalData[pixelIndex + 2] 
            )
          }
        }

        ctx.putImageData(imageData, 0, 0)
      }
    }
  }
}
