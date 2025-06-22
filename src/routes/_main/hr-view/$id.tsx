import { Button } from "@/components/ui/button"
import PageLayout from "@/layouts/page-layout"
import { downloadExcel } from "@/lib/download-excel"
import ViewPage from "@/pages/hr-details/view"
import axiosInstance from "@/services/axios-instance"
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router"
import { ArrowLeft, Download } from "lucide-react"
import { useState } from "react"

export const Route = createFileRoute("/_main/hr-view/$id")({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()
    const { id } = useParams({ from: "/_main/hr-view/$id" })
    const [isLoadingDown, setIsLoading] = useState(false)

    const handleExcel = async () => {
        setIsLoading(true)
        try {
            const resp = await axiosInstance.get(
                `hr/user-attendances-excel/${id}`,
                {
                    responseType: "blob",
                },
            )
            downloadExcel({ data: resp.data, name: `hodim_${id}` })
        } catch (err) {
            console.log(err)
        }
        setIsLoading(false)
    }

    return (
        <PageLayout>
            <div className="flex justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Button
                        className="min-w-4"
                        onClick={() => navigate({ to: "/hr" })}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-xl font-semibold">Hodim ma'lumoti</h1>
                </div>
                <Button
                    onClick={handleExcel}
                    loading={isLoadingDown}
                    className=" px-3"
                >
                    Yuklab olish <Download size={18} />
                </Button>
            </div>
            <ViewPage />
        </PageLayout>
    )
}
