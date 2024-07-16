"use client"

import * as React from "react"
import * as Querys from "@/api/query"
import { TYPE_COLORS } from "@/domain/constants"
import * as d3 from "d3"

import { Skeleton } from "@/components/ui/skeleton"
import { TypeCheckbox } from "@/components/TypeCheckbox"

export default function TypePage() {
  // useEffect(() => {
  //   draw()
  //   return () => {
  //     clean()
  //   }
  // }, [])

  const query = Querys.useFetchPokemonData()
  const types = React.useMemo(
    () => query.data?.data.pokemon_v2_type || [],
    [query.data]
  )

  return (
    <div className="flex flex-col gap-2">
      <div className="container flex gap-2 md:sticky md:top-[60px]">
        {query.data ? (
          <div className="flex gap-2 flex-wrap">
            {types.map((t) => (
              <TypeCheckbox key={t.id} type={t.name} />
            ))}
          </div>
        ) : (
          <TypeRadiosSkeleton />
        )}
      </div>
      <div>{query.data ? <div id="treemap"></div> : <TreemapSkeleton />}</div>
      <div className="h-[500vh]"></div>
    </div>
  )
}

function TypeRadiosSkeleton() {
  return (
    <>
      <Skeleton className="h-[40px] w-[150px] rounded-xl" />
      <Skeleton className="h-[40px] w-[150px] rounded-xl" />
      <Skeleton className="h-[40px] w-[150px] rounded-xl" />
      <Skeleton className="h-[40px] w-[150px] rounded-xl" />
      <Skeleton className="h-[40px] w-[150px] rounded-xl" />
      <Skeleton className="h-[40px] w-[150px] rounded-xl" />
    </>
  )
}

function TreemapSkeleton() {
  return <Skeleton className="h-[250px] w-100% rounded-xl" />
}

function draw() {
  function getRandomColor() {
    const colours = TYPE_COLORS
    const array = Object.values(colours)
    return array[Math.floor(Math.random() * array.length)]
  }

  // Function to generate random data
  function generateRandomData(numDirs: number) {
    const data = []
    const array = [0, 0.5, 1, 2, 4]
    for (let i = 1; i <= numDirs; i++) {
      const rand = array[Math.floor(Math.random() * array.length)]
      data.push({
        name: `${rand}X`,
        size: rand === 0 ? 0.25 : rand, // Random size between 100 and 10000
        // size: Math.floor(Math.random() * 10000) + 100, // Random size between 100 and 10000
        color1: getRandomColor(),
        color2: getRandomColor(),
      })
    }
    return data
  }

  const chartDiv = document.getElementById("treemap")

  // Generate 30 directories with random sizes and colors
  const data = generateRandomData(5)

  // Set dimensions
  const aspectRatio = 2 // 800 / 400
  const width = document.body.clientWidth
  const height = width / aspectRatio

  // Create a root node
  const root = d3
    .hierarchy({ values: data }, (d: any) => d.values)
    .sum((d: any) => {
      return d.size
    })
    .sort((a: any, b: any) => b.value - a.value) // Sort to have bigger boxes on top and left

  // Create a treemap layout
  d3.treemap().size([width, height]).padding(10)(root as any)

  // Select the div and append an SVG element
  const svg = d3
    .select("#treemap")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .style("width", "100%")
    .style("height", "auto")

  // Define gradients
  const defs = svg.append("defs")

  root.leaves().forEach((d: any, i) => {
    const gradient = defs
      .append("linearGradient")
      .attr("id", `grad${i}`)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%")

    gradient
      .append("stop")
      .attr("offset", "50%")
      .attr("stop-color", d.data.color1)

    gradient
      .append("stop")
      .attr("offset", "50%")
      .attr("stop-color", d.data.color2)
  })

  // Create nodes
  const nodes = svg
    .selectAll(".node")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d: any) => `translate(${d.x0},${d.y0})`)

  // Append rectangles
  nodes
    .append("rect")
    .attr("width", (d: any) => d.x1 - d.x0)
    .attr("height", (d: any) => d.y1 - d.y0)
    .attr("fill", (d, i) => `url(#grad${i})`)

  // Append text
  nodes
    .append("text")
    .attr("dx", function (d: any) {
      return (d.x1 - d.x0) / 2
    })
    .attr("dy", function (d: any) {
      return (d.y1 - d.y0) / 2
    })
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", "#ffffff")
    .attr("font-weight", "bold")
    .attr("font-size", `${chartDiv!.clientWidth * 0.007}em`)
    .text((d: any) => d.data.name)

  // handle click
  nodes.on("click", (...args) => {
    console.log(args)
  })
}

function clean() {
  d3.select("#treemap").selectAll("*").remove()
}
