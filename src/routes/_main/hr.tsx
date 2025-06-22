import PageLayout from "@/layouts/page-layout"
import HrPage from "@/pages/hr"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_main/hr")({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageLayout >
            <HrPage />
        </PageLayout>
    )
}
