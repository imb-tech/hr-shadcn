import { formatMoney } from "@/lib/format-money"
import { formatPhoneNumber } from "@/lib/format-phone-number"
import formatPassportNumber from "@/lib/formatter-pasport"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { useMemo } from "react"

export const useAllEmployeesListCols = () => {
    return useMemo<ColumnDef<Human>[]>(
        () => [
            {
                header: "Rasm",
                accessorKey: "face",
                cell: (value) => {
                    return (
                        <div className="max-w-8">
                            {/* <PopoverImage image={value} /> */}
                        </div>
                    )
                },
            },
            {
                header: "FIO",
                accessorKey: "full_name",
            },
            {
                header: "Telefon",
                accessorKey: "phone",
                cell: (value) => {
                    return (
                        <span className="whitespace-nowrap lg:break-all">
                            {formatPhoneNumber(String(value))}
                        </span>
                    )
                },
            },
            {
                header: "Lavozim",
                accessorKey: "role_name",
            },
            {
                header: "Kelish va Ketish",
                accessorKey: "id",
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
                                : ""}
                        </span>
                    )
                },
            },
            {
                header: "Ish vaqti",
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
            { header: "Manzil", accessorKey: "address" },
            {
                header: "Pasport",
                accessorKey: "id_number",
                cell: (value) => {
                    return (
                        <span className="whitespace-nowrap">
                            {value ? formatPassportNumber(String(value)) : "-"}
                        </span>
                    )
                },
            },
            {
                header: "Maosh",
                accessorKey: "salary",
                cell: (salary) => {
                    return formatMoney(Number(salary))
                },
            },
            {
                header: "Status",
                accessorKey: "status",
                cell: ({ row }) => {
                    const {
                        has_attendance,
                        excuses_status,
                        attendance_status,
                    } = row.original
                    return (
                        <div className="flex justify-center items-center">
                            <span
                                className={cn(
                                    "text-center whitespace-nowrap",
                                    has_attendance
                                        ? attendance_status == 1
                                            ? "text-green-400"
                                            : "text-orange-300"
                                        : excuses_status == 1
                                        ? "text-orange-400"
                                        : "text-red-500",
                                )}
                            >
                                {has_attendance
                                    ? attendance_status == 1
                                        ? "Vaqtida kelgan"
                                        : "Kech qolgan"
                                    : excuses_status == 1
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
