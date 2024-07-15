"use client"

import { useEffect } from "react"
import * as d3 from "d3"

export default function TypePage() {
  useEffect(() => {
    draw()
    return () => {
      clean()
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      const foo = (await import("@/data/pokemon-data.json")).default
      console.log("foo", foo)
    }
    fetchData()
  }, [])

  return (
    <div className="md:container">
      <div id="treemap"></div>
    </div>
  )
}

function draw() {
  function getRandomColor() {
    const colours = {
      normal: "#A8A77A",
      fire: "#EE8130",
      water: "#6390F0",
      electric: "#F7D02C",
      grass: "#7AC74C",
      ice: "#96D9D6",
      fighting: "#C22E28",
      poison: "#A33EA1",
      ground: "#E2BF65",
      flying: "#A98FF3",
      psychic: "#F95587",
      bug: "#A6B91A",
      rock: "#B6A136",
      ghost: "#735797",
      dragon: "#6F35FC",
      dark: "#705746",
      steel: "#B7B7CE",
      fairy: "#D685AD",
    }
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
