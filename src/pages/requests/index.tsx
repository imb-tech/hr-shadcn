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
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/useModal"
import Modal from "@/components/custom/modal"

export default function RequestsPage() {
    const search = useSearch({ strict: false })
    const { closeModal } = useModal()

    const {
        data: data,
        isSuccess,
        isLoading,
    } = useGet<ListResponse<StatusType>>(EXCUSE, {
        params: {
            ...search,
            page_size: search?.page_size || 25,
            status: search.status ?? 0,
        },
    })
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

    const { mutate, isPending } = usePatch({
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
            closeModal()
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
            <div className="mb-3 w-full flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
                <div className="max-w-[560px] overflow-x-auto no-scrollbar-x">
                    <ParamTabs
                        dontCleanOthers
                        paramName="status"
                        options={tabOptions}
                    />
                </div>
                <ParamDatePicker />
            </div>

            <DataTable
                numeration
                columns={useRequestsCols()}
                data={(isSuccess && data?.results) || []}
                loading={isLoading}
                paginationProps={{ totalPages: data?.total_pages }}
            />
            <Modal
                title={
                    status?.status == 2
                        ? "Rad etilsinmi?"
                        : status?.status == 1
                        ? "Ruxsat berilsinmi?"
                        : ""
                }
            >
                <div>
                    <div>
                        {status?.status === 2 ? (
                            <Textarea
                                className="w-full mb-4"
                                placeholder="Sabab..."
                                onChange={(e) => setComment(e.target.value)}
                            />
                        ) : null}
                        <div className="mt-2 flex justify-end">
                            {status?.status === 2 ? (
                                <Button
                                    disabled={Boolean(!comment)}
                                    variant="destructive"
                                    onClick={() => {
                                        updatesStatus()
                                    }}
                                    loading={isPending}
                                >
                                    Rad etish
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => {
                                        updatesStatus()
                                    }}
                                    loading={isPending}
                                >
                                    Ruxsat berish
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
