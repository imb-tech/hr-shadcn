import { formatMoney } from "@/lib/format-money"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { useMemo } from "react"

export const usHistoryCols = () => {
    return useMemo<ColumnDef<Payment>[]>(
        () => [
            {
                header: "Summasi",
                accessorKey: "amount",
                cell: ({ row: { original } }) => (
                    <span className="whitespace-nowrap md:break-all">
                        {formatMoney(original.amount)}
                    </span>
                ),
            },
            {
                header: "To'lov turi",
                accessorKey: "id",
                cell: ({ row: { original } }) => (
                    <div>
                        {
                            original.provider === 2 ?
                                // <img src="/images/click-dark.svg" width={40} />
                                <img
                                    src="https://clickday.uz/static/favicon.ico"
                                    width={18}
                                />
                                // <img src="/images/payme-dark.svg" width={40} />
                            :   <img
                                    src="https://cdn.payme.uz/payme-logos/ico/p/1/favicon-32x32.png"
                                    width={18}
                                />

                        }
                    </div>
                ),
            },
            {
                header: "To'lov sanai",
                accessorKey: "created_at",
                cell: ({ row: { original } }) => (
                    <span className="whitespace-nowrap md:break-all">
                        {format(original.created_at, "yyyy-MM-mm HH:mm")}
                    </span>
                ),
            },
            {
                header: "To'lov holati",
                accessorKey: "status",
                cell: ({ row: { original } }) => (
                    <div
                        className={cn(
                            "whitespace-nowrap text-center",
                            original.status == 1 ? "text-orange-500"
                            : original.status == 2 ? "text-green-500"
                            : "text-red-500",
                        )}
                    >
                        {original.status == 1 ?
                            "Kutilmoqda"
                        : original.status == 2 ?
                            "Tasdiqlangan"
                        :   "Bekor qilingan"}
                    </div>
                ),
            },
        ],
        [],
    )
}
