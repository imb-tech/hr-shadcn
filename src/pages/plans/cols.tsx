import { formatMoney } from "@/lib/format-money"
import { useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { monthKeys } from "./utils"

export const useHistoryCols = () => {
    return useMemo<ColumnDef<PlanHistory>[]>(
        () => [
            {
                header: "Tarif",
                accessorKey: "plan",
            },
            {
                header: "Narxi",
                cell({ row: { original } }) {
                    return <p>{formatMoney(original.amount)} so'm</p>
                },
            },
            {
                header: "Sana",
                accessorKey: "month",
                cell({ row: { original } }) {
                    return (
                        <p>
                            {monthKeys[original.month]}, {original.year}
                        </p>
                    )
                },
            },
            {
                header: " ",
                accessorKey: "actions",
            },
        ],
        [],
    )
}
