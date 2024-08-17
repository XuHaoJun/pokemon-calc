"use client"

import { resolve } from "path"
import * as React from "react"
import { useFetchPokemonData } from "@/api/query"
import { getPokemonImageSrc } from "@/utils/getPokemonImageSrc"
import * as R from "remeda"

import { useLoadPokemonLingui } from "@/hooks/useLoadPokemonLingui"

export function WhosThatPokemonPage() {
  const query = useFetchPokemonData()
  const randomPokemon = React.useMemo(
    () =>
      query.data ? R.sample(query.data?.data.pokemon_v2_pokemon, 1)[0] : null,
    [query.data]
  )

  const { updateOnce } = useLoadPokemonLingui({ targets: ["name"] })

  React.useEffect(() => {
    async function foo() {
      const canvas = randomPokemon
        ? await replaceNonTransparentPixelsWithBlack(
            getPokemonImageSrc(randomPokemon.id)
          )
        : null
      if (canvas) {
        const canvasContainer = document.querySelector("#canvas-container")
        if (canvasContainer) {
          canvasContainer.appendChild(canvas)
        }
      }
    }
    foo()
  }, [randomPokemon])
  return (
    <div className="md:container flex flex-col gap-2 py-6">
      <div id="canvas-container"></div>
      <div>answer: {randomPokemon?.name}</div>
    </div>
  )
}

function replaceNonTransparentPixelsWithBlack(
  imageSrc: string
): Promise<HTMLCanvasElement> {
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
      console.log(ctx)
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
      return resolve(canvas)
    }
  })
}
