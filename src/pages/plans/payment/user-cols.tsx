import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const usUsersCols = (price: number) => {
    return useMemo<ColumnDef<Record<string, string>>[]>(
        () => [
            {
                header: "Lavozim",
                accessorKey: "position",
            },
            {
                header: "FIO",
                accessorKey: "full_name",
            },
            {
                header: "Ta'rif holati",
                accessorKey: "status",
                cell: ({ row: { original } }) => (
                    <div
                        className={cn(
                            "whitespace-nowrap text-center",
                            !original.status ? "text-green-500" : (
                                "text-red-500"
                            ),
                        )}
                    >
                        {original.status ?
                            "Ta'rif mavjud "
                        :   `+ ${price.toLocaleString()}`}
                    </div>
                ),
            },
        ],
        [price],
    )
}
