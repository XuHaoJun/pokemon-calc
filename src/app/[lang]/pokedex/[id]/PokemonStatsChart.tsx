// recharts rsc support issue
// https://github.com/recharts/recharts/issues/4336
"use client"

import * as React from "react"
import { Pokemon } from "@/domain/pokemon"
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  value: {
    // TODO
    // replace to statName
    label: "Stat",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export interface PokemonStatsChartProps {
  pokemon: Pokemon
}

export function PokemonStatsChart(props: PokemonStatsChartProps) {
  const { pokemon } = props
  const chartData = React.useMemo(() => {
    return [
      { statName: "HP", statId: 1 },
      { statName: "Attack", statId: 2 },
      { statName: "Defense", statId: 3 },
      { statName: "Speed", statId: 6 },
      { statName: "Sp.Def", statId: 5 },
      { statName: "Sp.Atk", statId: 4 },
    ].map((x) => ({
      ...x,
      value: pokemon.pokemon_v2_pokemonstats[x.statId - 1]?.base_stat ?? 0,
    }))
  }, [pokemon])
  const total = React.useMemo(
    () =>
      pokemon.pokemon_v2_pokemonstats.reduce((acc, v) => acc + v.base_stat, 0),
    [pokemon]
  )
  return (
    <Card className="min-w-[320px]">
      <CardHeader className="pb-4">
        <CardTitle>Base Stats</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <RadarChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              bottom: 10,
              left: 30,
            }}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis
              tick={({ x, y, textAnchor, value, index, ...props }) => {
                const data = chartData[index]
                const finalY = index === 0 ? y - 10 : index === 3 ? y + 10 : y
                return (
                  <text
                    x={x}
                    y={finalY}
                    textAnchor={textAnchor}
                    fontSize={18}
                    fontWeight={500}
                    {...props}
                  >
                    <tspan>{data.value}</tspan>
                    <tspan
                      x={x}
                      dy={"1rem"}
                      fontSize={14}
                      className="fill-muted-foreground"
                    >
                      {data.statName}
                    </tspan>
                  </text>
                )
              }}
            />

            <PolarGrid />
            <Radar
              dataKey="value"
              fill="var(--color-value)"
              fillOpacity={0.6}
            />
            <PolarRadiusAxis
              angle={60}
              domain={[0, 255]}
              stroke="hsla(var(--foreground))"
              orientation="middle"
              axisLine={false}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 pt-4">
        <div>
          Total:<span className="font-bold ml-1 text-xl">{total}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
