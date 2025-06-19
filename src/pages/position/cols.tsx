import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const usPostionsCols = () => {
    return useMemo<ColumnDef<Position>[]>(
        () => [
            {
                header: "Lavozim",
                accessorKey: "name",
                cell({ row }) {
                    return (
                        <span className="whitespace-nowrap md:break-all flex sm:min-w-[240px]">
                            {row.original.name}
                        </span>
                    )
                },
            },
            {
                header: "Ish vaqti",
                accessorKey: "work_shift_end",
                cell: ({ row: { original } }) => (
                    <span className="whitespace-nowrap md:break-all">
                        {original.work_shift_start?.slice(0, 5)} -{" "}
                        {original.work_shift_end?.slice(0, 5)}
                    </span>
                ),
            },
            {
                header: "Hodimlar soni",
                accessorKey: "count",
            },
        ],
        [],
    )
}
