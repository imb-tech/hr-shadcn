import { EXCUSE, EXCUSE_COUNT } from "@/constants/api-endpoints"
import { useStore } from "@/hooks/use-store"
import { useGet } from "@/hooks/useGet"
import { usePatch } from "@/hooks/usePatch"
import { useQueryClient } from "@tanstack/react-query"
import { useSearch } from "@tanstack/react-router"
import { useState } from "react"
import { useRequestsCols } from "./cols"
import { toast } from "sonner"
import ParamTabs from "@/components/as-params/tabs"
import ParamDatePicker from "@/components/as-params/date-picker"
import { DataTable } from "@/components/ui/datatable"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/useModal"

export default function RequestsPage() {
    const search = useSearch({ strict: false })
    const { isOpen, closeModal } = useModal()

    const {
        data: data,
        isSuccess,
        isLoading,
    } = useGet<StatusType[]>(EXCUSE, { params: search })
    const { data: dataCount } = useGet<{ [key: string]: string | undefined }>(
        EXCUSE_COUNT,
    )

    const tabOptions = [
        { value: "0", label: `So'rovlar (${dataCount?.["0"] ?? 0})` },
        { value: "1", label: `Ruxsat berilganlar (${dataCount?.["1"] ?? 0})` },
        { value: "2", label: `Rad etilganlar (${dataCount?.["2"] ?? 0})` },
    ]

    const { store } = useStore<StatusType>("status-data")
    const queryClient = useQueryClient()
    const { store: status } = useStore<{ status: number | string }>("status")
    const [comment, setComment] = useState("")

    const { mutate } = usePatch({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [EXCUSE],
            })
            queryClient.invalidateQueries({
                queryKey: [EXCUSE_COUNT],
            })
            status?.status === 2
                ? toast.error("Ruxsat berilmadi")
                : toast.success("Muvaffaqiyatli ruxsat berildi")
        },
    })

    function updatesStatus() {
        if (status?.status === 2) {
            mutate(`${EXCUSE}/${store?.id}`, {
                status: status?.status,
                response_comment: comment,
            })
        } else {
            mutate(`${EXCUSE}/${store?.id}`, status)
        }
    }

    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <ParamTabs
                    dontCleanOthers
                    paramName="status"
                    options={tabOptions}
                />
                <ParamDatePicker className="w-auto" />
            </div>

            <DataTable
                columns={useRequestsCols()}
                data={(isSuccess && data) || []}
                loading={isLoading}
            />
            <Dialog
                open={isOpen}
                onOpenChange={(op) => (op ? closeModal : undefined)}
            >
                <DialogHeader className="flex flex-col gap-1 text-xl">
                    {status?.status == 2
                        ? "Rad etilsinmi?"
                        : status?.status == 1
                        ? "Ruxsat berilsinmi?"
                        : ""}
                </DialogHeader>
                <DialogContent>
                    {status?.status === 2 ? (
                        <Textarea
                            className="w-full"
                            placeholder="Sabab..."
                            onChange={(e) => setComment(e.target.value)}
                        />
                    ) : null}
                    <DialogFooter>
                        {status?.status === 2 ? (
                            <Button
                                color="danger"
                                disabled={Boolean(!comment)}
                                variant="secondary"
                                onClick={() => {
                                    updatesStatus()
                                }}
                            >
                                Rad etish
                            </Button>
                        ) : (
                            <Button
                                color="success"
                                onClick={() => {
                                    updatesStatus()
                                }}
                            >
                                Ruxsat berish
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
