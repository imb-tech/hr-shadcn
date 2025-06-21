import PButton from "@/components/ui/p-button"
import {
    HR_API,
    HR_EXCEL_DOWN,
    HR_EXCEL_TEMP,
    HR_EXCEL_UP,
    POSITION,
} from "@/constants/api-endpoints"
import { useStore } from "@/hooks/use-store"
import { useGet } from "@/hooks/useGet"
import { usePost } from "@/hooks/usePost"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { Download, FileText, Upload } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useHrListCols } from "./cols"
import { useModal } from "@/hooks/useModal"
import { toast } from "sonner"
import { downloadExcel } from "@/lib/download-excel"
import ParamInput from "@/components/as-params/input"
import { ParamCombobox } from "@/components/as-params/combobox"
import { DataTable } from "@/components/ui/datatable"
import DeleteModal from "@/components/custom/delete-modal"

export default function HrPage() {
    const { openModal } = useModal("delete")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    const params = useSearch({ from: "__root__" })
    const [excelDown, setExcelDow] = useState({ down: false, template: false })

    const { data: dataPosition } = useGet<Position[]>(POSITION)
    const { data: dataDown, isLoading: isLoadingDown } = useGet(HR_EXCEL_DOWN, {
        options: { enabled: excelDown.down },
        config: {
            responseType: "blob",
        },
    })
    const { data: dataTemplate, isLoading: isLoadingTemplate } = useGet(
        HR_EXCEL_TEMP,
        {
            options: { enabled: excelDown.template },
            config: {
                responseType: "blob",
            },
        },
    )
    const { data, isLoading, isSuccess, refetch } = useGet<ListResponse<Human>>(
        HR_API,
        {
            params: { ...params, page_size: 25 },
        },
    )

    const { mutate, isPending } = usePost(
        {
            onSuccess: () => {
                toast.success("Muaffaqiyatli qo'shildi")
                refetch()
            },
            onError: async (err) => {
                if (err.response && err.response.data instanceof Blob) {
                    try {
                        const text = await err.response.data.text()
                        const json = JSON.parse(text)
                        toast.error(
                            <pre className="text-left  bg-background text-sm">
                                {JSON.stringify(json, null, 2)}
                            </pre>,
                        )
                    } catch (e) {
                        console.error("Xatolikni o'qib bo'lmadi:", e)
                    }
                } else {
                    console.error("Xatolik:", err)
                }
            },
        },
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            responseType: "blob",
        },
    )
    const { store, setStore } = useStore<Human>("hr-data")

    function handleDelete(item: Human) {
        if (!item.id) return
        openModal()
        setStore(item)
    }

    const handleButtonClick = () => {
        fileInputRef.current?.click()
    }

    const handleExcel = (type: "down" | "template") => {
        if (type === "down") {
            setExcelDow((prev) => ({ ...prev, down: true }))
        } else if (type === "template") {
            setExcelDow((prev) => ({ ...prev, template: true }))
        }
    }
    const handleExcelUp = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const formData = new FormData()
            formData.append("file", file)
            mutate(HR_EXCEL_UP, formData)
        }
    }

    useEffect(() => {
        if (excelDown.down && dataDown) {
            downloadExcel({ data: dataDown })
            toast.success("Muaffaqiyatli yuklab olindi")
        } else if (excelDown.template && dataTemplate) {
            downloadExcel({ data: dataTemplate })
            toast.success("Muaffaqiyatli yuklab olindi")
        }
    }, [excelDown, dataDown, dataTemplate])

    return (
        <div>
            <DataTable
                numeration
                columns={useHrListCols(params?.search)}
                data={data?.results || []}
                loading={isLoading}
                onDelete={(row) => handleDelete(row.original)}
                actionPermissions={["employee_control"]}
                paginationProps={{
                    totalPages: data?.total_pages,
                }}
                onEdit={(item) => {
                    if (!item.id) return
                    navigate({ to: `/hr-edit/${item.id}` })
                }}
                onRowClick={(item) => navigate({ to: `/hr-view/${item.id}` })}
                head={
                    <div className="grid lg:grid-cols-3 gap-3 w-full mb-3">
                        <ParamInput fullWidth  />
                        <ParamCombobox
                            className="max-w-full sm:w-80 "
                            labelKey="name"
                            valueKey="id"
                            options={dataPosition || []}
                            paramName="role_id"
                            label="Lavozimlar"
                        />
                        <div className="w-full flex items-center gap-3">
                            <PButton
                                allow={["employee_upload"]}
                                loading={isLoadingTemplate}
                                onClick={() => handleExcel("template")}
                                className="w-full px-2"
                            >
                                Shablon
                                <FileText size={18} />
                            </PButton>
                            <>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleExcelUp}
                                    className="hidden"
                                    accept=".xlsx"
                                />
                                <PButton
                                    allow={["employee_upload"]}
                                    loading={isPending}
                                    disabled={isPending}
                                    onClick={handleButtonClick}
                                    className="w-full px-2"
                                >
                                    Yuklash{" "}
                                    <Upload size={18} className="ml-2" />
                                </PButton>
                            </>
                            <PButton
                                allow={["employee_download"]}
                                loading={isLoadingDown}
                                onClick={() => handleExcel("down")}
                                className="w-full px-2"
                            >
                                Yuklab olish <Download size={18} />
                            </PButton>
                        </div>
                    </div>
                }
            />
            <DeleteModal id={store?.id} path={HR_API} />
        </div>
    )
}
