"use client"

import * as React from "react"
import NextImage from "next/image"
import { Pokemon2, Unarray } from "@/domain/pokemon"
import { ColumnDef } from "@tanstack/react-table"
import * as R from "remeda"

import { SimpleHeader } from "@/components/data-table/SimpleHeader"
import { TypeBadge } from "@/components/TypeBadge"

import { MoveDataTable } from "./MoveDataTable"

export interface MoveTableProps {
  moves: Pokemon2["moves"]
  hideColumns?: string[]
}

type Pokemon2Move = Unarray<Pokemon2["moves"]>
type ColumnType = ColumnDef<Pokemon2Move>

export function MoveTable({ moves, hideColumns }: MoveTableProps) {
  const columns: ColumnType[] = React.useMemo(
    () =>
      (
        [
          {
            accessorKey: "level",
            header: (headerContext) => {
              return (
                <SimpleHeader headerContext={headerContext}>Level</SimpleHeader>
              )
            },
          },
          {
            accessorKey: "nameDisplay",
            header: (headerContext) => {
              return (
                <SimpleHeader headerContext={headerContext}>Name</SimpleHeader>
              )
            },
          },
          {
            accessorKey: "move.pokemon_v2_type.name",
            header: (headerContext) => {
              return (
                <SimpleHeader headerContext={headerContext}>Type</SimpleHeader>
              )
            },
            cell: (cellCtx) => {
              const { row } = cellCtx
              return (
                <div className="flex flex-col gap-1">
                  {row.original.move.pokemon_v2_type?.name && (
                    <TypeBadge type={row.original.move.pokemon_v2_type.name} />
                  )}
                </div>
              )
            },
          },
          {
            accessorKey: "move.pokemon_v2_movedamageclass.name",
            header: (headerContext) => {
              return (
                <SimpleHeader headerContext={headerContext}>Cat.</SimpleHeader>
              )
            },
            cell: (cellCtx) => {
              const { row } = cellCtx
              return (
                <div className="flex flex-col gap-1">
                  {row.original.move.pokemon_v2_movedamageclass?.name && (
                    <NextImage
                      alt={row.original.move.pokemon_v2_movedamageclass?.name}
                      src={`/pokemon-calc/images/SPLIT_${row.original.move.pokemon_v2_movedamageclass.name.toUpperCase()}.png`}
                      width={40}
                      height={40}
                    />
                  )}
                </div>
              )
            },
          },
          {
            accessorKey: "move.power",
            header: (headerContext) => {
              return (
                <SimpleHeader headerContext={headerContext}>Pwr.</SimpleHeader>
              )
            },
          },
          {
            accessorKey: "move.accuracy",
            header: (headerContext) => {
              return (
                <SimpleHeader headerContext={headerContext}>Acc.</SimpleHeader>
              )
            },
          },
          {
            accessorKey: "move.pp",
            header: (headerContext) => {
              return (
                <SimpleHeader headerContext={headerContext}>PP</SimpleHeader>
              )
            },
          },
          {
            accessorKey: "flavorTextDisplay",
            header: (headerContext) => {
              return (
                <SimpleHeader headerContext={headerContext}>
                  Effect
                </SimpleHeader>
              )
            },
          },
        ] as ColumnType[]
      ).filter(
        // FIXME
        // incorrect type
        (x: any) => !hideColumns?.includes(x.accessorKey)
      ),
    [hideColumns]
  )
  return <MoveDataTable columns={columns} data={moves} />
}
