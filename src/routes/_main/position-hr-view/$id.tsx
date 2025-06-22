import { Button } from "@/components/ui/button"
import PageLayout from "@/layouts/page-layout"
import PositionHrView from "@/pages/office-detail/position"
import {
    createFileRoute,
    useNavigate,
    useParams,
} from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"

export const Route = createFileRoute("/_main/position-hr-view/$id")({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()
    const parmas = useParams({ strict: false })


    return (
        <PageLayout>
            <div className="flex items-center gap-3 mb-3">
                <Button
                    className="min-w-4"
                    onClick={() =>
                        navigate({
                            to: "/office/$id",
                            params: { id: parmas?.id?.toString() as any },
                        })
                    }
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-xl font-semibold">Lavozim bo'yicha hodimlar</h1>
            </div>
            <PositionHrView />
        </PageLayout>
    )
}
