import PageLayout from "@/layouts/page-layout"
import RequestsPage from "@/pages/requests"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_main/requests/")({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageLayout breadcrumb={["So'rovlar ro'yxati"]}>
            <RequestsPage />
        </PageLayout>
    )
}
