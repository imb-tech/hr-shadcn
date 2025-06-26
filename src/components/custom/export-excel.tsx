import { downloadExcel } from "@/lib/download-excel"
import { onError } from "@/lib/onError"
import { Download } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "../ui/button"
import FormAction from "./form-action"
import Modal from "./modal"
import { useModal } from "@/hooks/useModal"
import { useGet } from "@/hooks/useGet"
import { FormDatePicker } from "../form/date-picker"
import { baseURLOrigin } from "@/services/axios-instance"

type Dates = {
    start: string
    end: string
    date: string
}

const baseURL = baseURLOrigin

const ExportAsExcel = ({
    url,
    name,
    inputDate,
    inputInterval,
    params = {},
    label = "Yuklab olish",
}: {
    url: string
    name: string
    inputDate?: boolean
    inputInterval?: boolean
    params?: Record<string, string | number | boolean>
    label?: string
}) => {
    const { openModal, closeModal } = useModal("select-interval" + url)
    const [loading, setLoading] = useState<boolean>(false)

    const { refetch, isFetching } = useGet(url, {
        options: { enabled: false },
        config: { responseType: "blob" },
    })

    const trigger = async () => {
        if (inputDate || inputInterval) {
            return openModal()
        }
        const { data, isSuccess, isError, error } = await refetch()
        if (isSuccess) {
            downloadExcel({ data, name })
        }
        if (isError) {
            onError(error)
        }
    }

    const methods = useForm<Dates>()

    async function handleSubmit(vals: Dates) {
        setLoading(true)
        const searchParams = new URLSearchParams({ ...vals, ...params })
        const response = await fetch(`${baseURL}${url}?` + searchParams, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("user_access")}`,
            },
        })
        if (response.status === 200) {
            const blobData = await response.blob()
            downloadExcel({
                data: blobData,
                name:
                    inputInterval ?
                        `${vals.start}_${vals.end}_kora_${name}`
                    :   `${vals.date}_kora_${name}`,
            })
        } else toast.error("Yuklab olishda xatolik")
        methods.reset()
        closeModal()
        setLoading(false)
    }

    return (
        <div className="inline-block">
            {!url || url === "" ?
                ""
            :   <Button
                    variant="outline"
                    icon={<Download width={16} />}
                    loading={isFetching}
                    onClick={trigger}
                >
                    <span className="hidden sm:block">{label}</span>
                </Button>
            }

            <Modal
                title={
                    inputInterval ?
                        "Oraliq sanani tanlang"
                    :   " Hisobot sanasini tanlang"
                }
                modalKey={"select-interval" + url}
                className=" overflow-visible"
            >
                <form onSubmit={methods.handleSubmit(handleSubmit)}>
                    {inputInterval ?
                        <div className="grid grid-cols-2 gap-2 py-2">
                            <FormDatePicker
                                control={methods.control}
                                name="start"
                                label="Boshlanish"
                                required
                            />
                            <FormDatePicker
                                control={methods.control}
                                name="end"
                                label="Tugash"
                                required
                            />
                        </div>
                    :   <FormDatePicker
                            control={methods.control}
                            name="date"
                            label="Sana"
                            required
                        />
                    }

                    <FormAction submitName="Yuklab olish" loading={loading} />
                </form>
            </Modal>
        </div>
    )
}

export default ExportAsExcel
