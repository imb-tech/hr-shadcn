import { Button } from "@/components/ui/button"
import PageLayout from "@/layouts/page-layout"
import CreateHrForm from "@/pages/hr/create-hr-form"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"

export const Route = createFileRoute("/_main/hr-create")({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()

    return (
        <PageLayout breadcrumb={["Hodimlar"]}>
            <Button
                className="min-w-4"
                variant="default"
                onClick={() => navigate({ to: "/hr" })}
            >
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <CreateHrForm />
        </PageLayout>
    )
}
