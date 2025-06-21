import SeeInView from "@/components/ui/see-in-view"
import findHighlights from "@/lib/find-highlights"
import { formatMoney } from "@/lib/format-money"
import { formatPhoneNumber } from "@/lib/format-phone-number"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const useHrListCols = (query?: string) => {
    return useMemo<ColumnDef<Human>[]>(
        () => [
            {
                header: "Rasm",
                accessorKey: "face",
                cell: ({ row }) => (
                    <SeeInView
                        url={String(row.original.face)}
                        className={"object-cover h-9 w-9 rounded-md"}
                    />
                ),
            },
            {
                header: "FIO",
                accessorKey: "first_name",
                enableSorting:true,
                cell: ({ row }) => {
                    const { last_name, first_name, middle_name } = row.original
                    return (
                        <span className="whitespace-nowrap lg:break-all">
                            {findHighlights(
                                `${first_name} ${last_name} ${middle_name}`,
                                query ?? "",
                                "",
                            )}
                        </span>
                    )
                },
            },
            {
                header: "Telefon",
                accessorKey: "phone_number",
                enableSorting:true,
                cell: ({ row }) => {
                    const { phone_number } = row.original
                    return (
                        <span className="whitespace-nowrap lg:break-all">
                            {formatPhoneNumber(String(phone_number))}
                        </span>
                    )
                },
            },
            {
                header: "Lavozim",
                accessorKey: "role_name",
                enableSorting:true,
            },
            {
                header: "Maosh",
                accessorKey: "salary",
                enableSorting:true,
                cell: ({row}) => {
                  const { salary } = row.original
                    return formatMoney(Number(salary))
                },
            },
        ],
        [query],
    )
}
