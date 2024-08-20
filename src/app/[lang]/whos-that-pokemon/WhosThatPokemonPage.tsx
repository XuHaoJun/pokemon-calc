"use client"

import * as React from "react"
import NextImage from "next/image"
import { useFetchPokemonData } from "@/api/query"
import { getPokemonImageSrc } from "@/utils/getPokemonImageSrc"
import { Trans } from "@lingui/macro"
import * as R from "remeda"

import { useLoadPokemonLingui } from "@/hooks/useLoadPokemonLingui"
import { Button } from "@/components/ui/button"

export function WhosThatPokemonPage() {
  useLoadPokemonLingui({ targets: ["name"] })

  const query = useFetchPokemonData()

  const [randomSeed, setRandomSeed] = React.useState(new Date())

  const randomPokemon = React.useMemo(
    () =>
      query.data && randomSeed
        ? R.sample(query.data?.data.pokemon_v2_pokemon, 1)[0]
        : null,
    [query.data, randomSeed]
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
    result.canvas.id = "pokemon-image"
    result.canvas.style = "width: 300px; height: 300px;"
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
      showAnswerFunc(
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
        {showAnswer ? (
          <div>
            <Trans>answer</Trans>: {randomPokemon?.name}
          </div>
        ) : (
          <div className="h-[24px]"></div>
        )}
      </div>
      <div className="flex gap-2">
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

interface CanvasWithImageData {
  canvas: HTMLCanvasElement
  image: HTMLImageElement
  originalImageData: ImageData
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
      resolve({ canvas, image: img, originalImageData, context: ctx })
      return
    }
  })
}
function showAnswerFunc(ctx: any, originalImageData: any) {
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
  }, 1000 / height) // Duration divided by the number of lines
}
