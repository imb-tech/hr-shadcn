import { Button } from "@/components/ui/button"
import PageLayout from "@/layouts/page-layout"
import ArrivalsPage from "@/pages/arrivals"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"

export const Route = createFileRoute("/_main/arrivals")({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()

    return (
        <PageLayout>
            <div className="flex items-center gap-3 mb-3">
                <Button
                    className="min-w-4"
                    onClick={() =>
                        navigate({
                            to: "/",
                        })
                    }
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-xl font-semibold">Kelganlar ro'yxati</h1>
            </div>
            <ArrivalsPage />
        </PageLayout>
    )
}
