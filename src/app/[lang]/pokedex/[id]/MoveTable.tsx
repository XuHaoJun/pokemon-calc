"use client"

import React from "react"
import { Pokemon2, Unarray } from "@/domain/pokemon"
import { ColumnDef } from "@tanstack/react-table"

import { SimpleHeader } from "@/components/data-table/SimpleHeader"
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
        accessorKey: "typeName",
        header: (headerContext) => {
          return <SimpleHeader headerContext={headerContext}>Type</SimpleHeader>
        },
        cell: (cellCtx) => {
          const { row } = cellCtx
          return (
            <div className="flex flex-col gap-1">
              <TypeBadge type={row.getValue("typeName")} />
            </div>
          )
        },
      },
      {
        accessorKey: "damageClassDisplay",
        header: (headerContext) => {
          return <SimpleHeader headerContext={headerContext}>Cat.</SimpleHeader>
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
