"use client"

import React from "react"
import { Pokemon2, Unarray } from "@/domain/pokemon"
import { ColumnDef } from "@tanstack/react-table"

import { SimpleHeader } from "@/components/data-table/SimpleHeader"
import { MstSvIcon } from "@/components/MstSvIcon"
import { TypeBadge } from "@/components/TypeBadge"

import { MoveDataTable } from "./MoveDataTable"

export interface MoveTableProps {
  moves: Pokemon2["moves"]
}

export function MoveTable({ moves }: MoveTableProps) {
  const columns: ColumnDef<Unarray<Pokemon2["moves"]>>[] = React.useMemo(
    () => [
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
          return <SimpleHeader headerContext={headerContext}>Name</SimpleHeader>
        },
      },
      {
        accessorKey: "move.pokemon_v2_type.name",
        header: (headerContext) => {
          return <SimpleHeader headerContext={headerContext}>Type</SimpleHeader>
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
          return <SimpleHeader headerContext={headerContext}>Cat.</SimpleHeader>
        },
        cell: (cellCtx) => {
          const { row } = cellCtx
          return (
            <div className="flex flex-col gap-1">
              {row.original.move.pokemon_v2_movedamageclass?.name && (
                <MstSvIcon
                  type={row.original.move.pokemon_v2_movedamageclass.name}
                />
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "move.power",
        header: (headerContext) => {
          return <SimpleHeader headerContext={headerContext}>Pwr.</SimpleHeader>
        },
      },
      {
        accessorKey: "move.accuracy",
        header: (headerContext) => {
          return <SimpleHeader headerContext={headerContext}>Acc.</SimpleHeader>
        },
      },
      {
        accessorKey: "move.pp",
        header: (headerContext) => {
          return <SimpleHeader headerContext={headerContext}>PP</SimpleHeader>
        },
      },
    ],
    []
  )
  return <MoveDataTable columns={columns} data={moves} />
}
