import SeeInView from "@/components/ui/see-in-view"
import { formatMoney } from "@/lib/format-money"
import { formatPhoneNumber } from "@/lib/format-phone-number"
import formatPassportNumber from "@/lib/formatter-pasport"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { useMemo } from "react"

export const useArrivalsListCols = () => {
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
                header: "Kelish va Ketish",
                accessorKey: "id",
                enableSorting: true,
                cell: ({ row }) => {
                    const { attendance_json } = row.original
                    return (
                        <span className="whitespace-nowrap lg:break-all">
                            {attendance_json?.attendance_time
                                ? format(
                                      attendance_json?.attendance_time,
                                      "HH:mm",
                                  )
                                : "-"}{" "}
                            -
                            {attendance_json?.left_time
                                ? format(attendance_json?.left_time, "HH:mm")
                                : "-"}
                        </span>
                    )
                },
            },
            {
                header: "Ish vaqti",
                enableSorting: true,
                accessorKey: "work_shift_start",
                cell: ({ row }) => {
                    const { work_shift_start, work_shift_end } = row.original
                    return (
                        <span className="whitespace-nowrap lg:break-all">
                            {work_shift_start?.slice(0, 5)} -{" "}
                            {work_shift_end?.slice(0, 5)}
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
                accessorKey: "attendance_status",
                enableSorting: true,
                cell: ({ row }) => {
                    const { attendance_status } = row.original
                    return (
                        <div className="flex justify-center items-center">
                            <span
                                className={cn(
                                    "text-center whitespace-nowrap",
                                    attendance_status == 1
                                        ? "text-green-400 "
                                        : "text-orange-300 ",
                                )}
                            >
                                {attendance_status == 1
                                    ? "Vaqtida kelgan"
                                    : "Kech qolgan"}
                            </span>
                        </div>
                    )
                },
            },
        ],
        [],
    )
}
