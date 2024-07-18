"use client"

import * as React from "react"
import * as Querys from "@/api/query"
import { TYPE_ATTACK_RESITANCE, TYPE_COLORS } from "@/domain/constants"
import type { Pokemon, PokemonType } from "@/domain/pokemon"
import * as d3 from "d3"
import * as R from "remeda"
import { useMutative } from "use-mutative"

import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { TypeCheckbox } from "@/components/TypeCheckbox"

export default function TypeCalcPage() {
  const query = Querys.useFetchPokemonData()

  const types = React.useMemo(
    () =>
      R.filter(
        query.data?.data.pokemon_v2_type || [],
        R.isNot((t) => ["stellar", "unknown", "shadow"].includes(t.name))
      ),
    [query.data?.data.pokemon_v2_type]
  )

  const [selectedTypes, setSelectedTypes] = useMutative(new Set<string>())
  const pkmExistsTypes = React.useMemo(() => {
    const pkms = query.data?.data.pokemon_v2_pokemon || []
    const founds: Set<string> = new Set([])
    const pkmGroups: Record<string, Pokemon[]> = {}
    const sperator = ","
    for (const pkm of pkms) {
      const typeIdsStr = pkm.pokemon_v2_pokemontypes
        .map((t) => t.type_id)
        .sort()
        .join(sperator)
      founds.add(typeIdsStr)
      if (!Array.isArray(pkmGroups[typeIdsStr])) {
        pkmGroups[typeIdsStr] = []
      }
      pkmGroups[typeIdsStr].push(pkm)
    }
    const result: { types: PokemonType[]; pokemons: Pokemon[] }[] = []
    founds.forEach((typeIdsStr) => {
      const typeIds = typeIdsStr.split(sperator)
      result.push({
        types: typeIds.map((id) => {
          const t = query.data?.data.pokemon_v2_type.find(
            (t) => `${t.id}` === id
          ) as PokemonType
          return t
        }),
        pokemons: pkmGroups[typeIdsStr],
      })
    })
    return result
  }, [query.data])

  const typeResitanceMatrix = React.useMemo(() => {
    const attackType = [...selectedTypes.values()][0]
    if (!attackType) {
      return []
    }
    return pkmExistsTypes.map((typesGroup) => {
      const types = typesGroup.types
      let typeEffective = 1
      if (types[0]?.name) {
        typeEffective *= TYPE_ATTACK_RESITANCE[attackType][types[0].name]
      }
      if (types[1]?.name) {
        typeEffective *= TYPE_ATTACK_RESITANCE[attackType][types[1].name]
      }
      return {
        name: `${typeEffective}X`,
        typeEffective,
        size: typeEffective === 0 ? 0.125 : typeEffective,
        color1: TYPE_COLORS[types[0].name],
        color2: TYPE_COLORS[types[1]?.name] ?? TYPE_COLORS[types[0]?.name],
        type1: types[0]?.name ?? "",
        type2: types[1]?.name ?? types[0]?.name ?? "",
        pokemons: typesGroup.pokemons,
      }
    })
  }, [pkmExistsTypes, selectedTypes])

  const [filter, setFilter] = useMutative({
    hide42: false,
    hide1: false,
    hide05025: false,
    hide0: false,
    hideTwoType: false,
  })
  const [controll, setControll] = useMutative({ reverseSize: false })

  const finalTypeResitanceMatrix = React.useMemo(() => {
    let result = typeResitanceMatrix
    if (
      filter.hide42 ||
      filter.hide1 ||
      filter.hide05025 ||
      filter.hide0 ||
      filter.hideTwoType
    ) {
      result = R.filter(
        typeResitanceMatrix,
        R.isNot(
          (x) =>
            (filter.hide42
              ? x.typeEffective === 4 || x.typeEffective === 2
              : false) ||
            (filter.hide1 ? x.typeEffective === 1 : false) ||
            (filter.hide05025
              ? x.typeEffective === 0.5 || x.typeEffective === 0.25
              : false) ||
            (filter.hide0 ? x.typeEffective === 0 : false) ||
            (filter.hideTwoType ? x.type1 !== x.type2 : false)
        )
      )
    }
    if (controll.reverseSize) {
      result = result.map((x) => ({ ...x, size: 1 / x.size }))
    }
    return result
  }, [typeResitanceMatrix, filter, controll])

  React.useEffect(() => {
    clean()
    if (finalTypeResitanceMatrix.length > 0) {
      draw(finalTypeResitanceMatrix)
    }
    return () => {
      clean()
    }
  }, [finalTypeResitanceMatrix])

  return (
    <div className="flex flex-col gap-2 py-6">
      <div className="container flex flex-col gap-2 md:sticky md:top-[60px]">
        {query.data ? (
          <div className="flex gap-2 flex-wrap">
            {types.map((t) => (
              <TypeCheckbox
                key={t.id}
                type={t.name}
                checked={selectedTypes.has(t.name)}
                onChange={(nextChecked, typeName) => {
                  setSelectedTypes((draft) => {
                    // if (nextChecked) {
                    //   draft.add(typeName)
                    // } else {
                    //   draft.delete(typeName)
                    // }
                    if (nextChecked) {
                      draft.clear()
                      draft.add(typeName)
                    } else {
                      draft.delete(typeName)
                    }
                  })
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex gap-2 flex-wrap">
            <TypeRadiosSkeletons />
          </div>
        )}
        <div className="flex gap-2 flex-wrap">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => {
              setFilter((draft) => {
                draft.hide42 = !draft.hide42
              })
            }}
          >
            <Switch checked={filter.hide42} />
            <Label className="cursor-pointer">Hide 4x, 2x</Label>
          </div>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => {
              setFilter((draft) => {
                draft.hide1 = !draft.hide1
              })
            }}
          >
            <Switch checked={filter.hide1} />
            <Label className="cursor-pointer">Hide 1x</Label>
          </div>
          <div
            className="flex items-center space-x-2 select-none cursor-pointer"
            onClick={() => {
              setFilter((draft) => {
                draft.hide05025 = !draft.hide05025
              })
            }}
          >
            <Switch checked={filter.hide05025} />
            <Label className="cursor-pointer">Hide 0.5x, 0.25x</Label>
          </div>
          <div
            className="flex items-center space-x-2 select-none cursor-pointer"
            onClick={() => {
              setFilter((draft) => {
                draft.hide0 = !draft.hide0
              })
            }}
          >
            <Switch checked={filter.hide0} />
            <Label className="cursor-pointer">Hide 0x</Label>
          </div>
          <div
            className="flex items-center space-x-2 select-none cursor-pointer"
            onClick={() => {
              setFilter((draft) => {
                draft.hideTwoType = !draft.hideTwoType
              })
            }}
          >
            <Switch checked={filter.hideTwoType} />
            <Label className="cursor-pointer">Hide Two Type</Label>
          </div>
          <div
            className="flex items-center space-x-2 select-none cursor-pointer"
            onClick={() => {
              setControll((draft) => {
                draft.reverseSize = !draft.reverseSize
              })
            }}
          >
            <Switch checked={controll.reverseSize} />
            <Label className="cursor-pointer">Reverse Order</Label>
          </div>
        </div>
      </div>
      <div id="treemap"></div>
    </div>
  )
}

function TypeRadiosSkeletons() {
  return (
    <>
      {[...Array(18).keys()].map((i) => (
        <Skeleton key={i} className="h-[40px] w-[140px] rounded-xl" />
      ))}
    </>
  )
}

function TreemapSkeleton() {
  return <Skeleton className="h-[50vh] w-100% rounded-xl" />
}

function draw(_data?: any) {
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
  const data = _data || generateRandomData(5)

  // Set dimensions
  const aspectRatio = 2 // 800 / 400
  const width = document.body.clientWidth
  const height = (width / aspectRatio) * 3

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
    .attr("font-size", 16)
    .text((d: any) => d.data.name)

  // Append text
  nodes
    .append("text")
    .attr("dx", function (d: any) {
      return 10
    })
    .attr("dy", function (d: any) {
      return 16
    })
    .attr("fill", "#ffffff")
    .attr("font-weight", "bold")
    .attr("font-size", 16)
    .text((d: any) => d.data.type1)

  nodes
    .append("text")
    .attr("dx", function (d: any) {
      return 10
    })
    .attr("dy", function (d: any) {
      return (d.y1 - d.y0) / 2 + 16
    })
    .attr("fill", "#ffffff")
    .attr("font-weight", "bold")
    .attr("font-size", "16px")
    .text((d: any) => (d.data.type1 === d.data.type2 ? "" : d.data.type2))

  nodes
    .append("svg:image")
    .attr("width", 64)
    .attr("height", 64)
    .attr("dx", function (d: any) {
      return 0
    })
    .attr("dy", function (d: any) {
      return 0
    })
    .attr("y", function (d: any) {
      return 24
    })
    .attr("xlink:href", function (d: any) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${d.data.pokemons[0].id}.png`
    })

  // nodes
  //   .append("svg:image")
  //   .attr("width", 64)
  //   .attr("height", 64)
  //   .attr("x", 32)
  //   .attr("dx", function (d: any) {
  //     return 0
  //   })
  //   .attr("dy", function (d: any) {
  //     return 0
  //   })
  //   .attr("xlink:href", function (d) {
  //     console.log("d", d)
  //     if (d.data.pokemons[1]?.id) {
  //       return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${d.data.pokemons[1]?.id}.png`
  //     } else {
  //       return null
  //     }
  //   })

  // handle click
  nodes.on("click", (event, node) => {})
}

function clean() {
  d3.select("#treemap").selectAll("*").remove()
}
