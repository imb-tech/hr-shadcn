import Private from "@/components/private"
import { Button } from "@/components/ui/button"
import SeeInView from "@/components/ui/see-in-view"
import { useStore } from "@/hooks/use-store"
import { useModal } from "@/hooks/useModal"
import { formatDateTime } from "@/lib/format-date"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { Check, X } from "lucide-react"
import { useMemo } from "react"

export const useRequestsCols = () => {
    const { openModal } = useModal()
    const { setStore: setStoreData } = useStore<StatusType>("status-data")
    const { setStore: setStatus } = useStore<{ status: number | string }>(
        "status",
    )

    function handleItem(item: StatusType) {
        if (!item.id) return
        setStoreData(item)
        openModal()
    }

    return useMemo<ColumnDef<StatusType>[]>(
        () => [
            {
                header: "Rasm",
                accessorKey: "face",
                cell: ({ row: { original } }) => {
                    return (
                        <SeeInView
                            url={String(original.face)}
                            className={"object-cover h-9 w-9 rounded-md"}
                        />
                    )
                },
            },
            {
                header: "FIO",
                accessorKey: "full_name",
                cell({ row: { original } }) {
                    return (
                        <span className="whitespace-nowrap">
                            {original.full_name}
                        </span>
                    )
                },
            },
            {
                header: "So'ralgan kunlar",
                accessorKey: "start",
                cell({ row: { original } }) {
                    return (
                        <span className="whitespace-nowrap">
                            {formatDateTime(original.start)} -{" "}
                            {formatDateTime(original.end)}
                        </span>
                    )
                },
            },
            {
                header: "Sababi",
                accessorKey: "comment",
            },
            {
                header: "Rad etish sababi",
                accessorKey: "response_comment",
            },
            {
                header: "Holat",
                accessorKey: "id",
                cell({ row: { original } }) {
                    return original.status === 0 ?
                            <Private allow={["excuse_confirmed"]}>
                                <div className="flex items-center justify-end">
                                    <Button
                                        className="min-w-4 text-red-500 hover:text-red-600 hover:bg-destructive/20"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                            handleItem(original),
                                                setStatus({ status: 2 })
                                        }}
                                    >
                                        <X size={20} />
                                    </Button>
                                    <Button
                                        className="min-w-4 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                            handleItem(original),
                                                setStatus({ status: 1 })
                                        }}
                                    >
                                        <Check size={20} />
                                    </Button>
                                </div>
                            </Private>
                        :   <div className={"flex w-full justify-end"}>
                                <Button
                                    className={cn(`flex`,
                                        original.status === 2 ? "justify-end text-red-500 hover:text-red-600 hover:bg-destructive/20" : "justify-start hover:text-green-600 hover:bg-green-500/10 text-green-500"
                                    )}
                                    variant="ghost"
                                >
                                    {original.status === 2 ?
                                        "Rad etilgan"
                                    :   "Ruxsat berilgan"}
                                </Button>
                            </div>
                },
            },
        ],
        [],
    )
}
