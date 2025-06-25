import SeeInView from "@/components/ui/see-in-view"
import { formatMoney } from "@/lib/format-money"
import { formatPhoneNumber } from "@/lib/format-phone-number"
import formatPassportNumber from "@/lib/formatter-pasport"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const useAbsentListCols = () => {
    return useMemo<ColumnDef<Human>[]>(
        () => [
            {
                header: "Rasm",
                accessorKey: "face",
                cell: ({ row }) => {
                    return (
                        <SeeInView
                            url={row.original.face}
                            className={"object-cover h-9 w-9 rounded-md"}
                        />
                    )
                },
            },
            {
                header: "FIO",
                accessorKey: "full_name",
                enableSorting: true,
            },
            {
                header: "Telefon",
                accessorKey: "phone",
                enableSorting: true,
                cell: ({ row }) => {
                    const { phone } = row.original
                    return (
                        <span className="whitespace-nowrap lg:break-all">
                            {formatPhoneNumber(String(phone))}
                        </span>
                    )
                },
            },
            {
                header: "Lavozim",
                accessorKey: "role_name",
                enableSorting: true,
            },
            {
                header: "Ish vaqti",
                accessorKey: "work_shift_start",
                enableSorting: true,
                cell: ({ row }) => {
                    return (
                        <span className="whitespace-nowrap lg:break-all">
                            {row.original?.work_shift_start?.slice(0, 5)} -{" "}
                            {row.original?.work_shift_end?.slice(0, 5)}
                        </span>
                    )
                },
            },
            { header: "Manzil", accessorKey: "address", enableSorting: true },
            {
                header: "Pasport",
                accessorKey: "id_number",
                enableSorting: true,
                cell: ({ row }) => {
                    const { id_number } = row.original
                    return (
                        <span className="whitespace-nowrap">
                            {id_number
                                ? formatPassportNumber(String(id_number))
                                : "-"}
                        </span>
                    )
                },
            },
            {
                header: "Maosh",
                accessorKey: "salary",
                enableSorting: true,
                cell: (salary) => {
                    return formatMoney(Number(salary))
                },
            },
            {
                header: "Status",
                accessorKey: "excuses_status",
                enableSorting: true,
                cell: ({ row }) => {
                    return (
                        <div className="flex justify-center items-center">
                            <span
                                className={cn(
                                    "text-center",
                                    row.original.excuses_status == 1
                                        ? "text-orange-400 "
                                        : "text-red-500 ",
                                )}
                            >
                                {row.original.excuses_status == 1
                                    ? "Sababli"
                                    : "Sababsiz"}
                            </span>
                        </div>
                    )
                },
            },
        ],
        [],
    )
}
