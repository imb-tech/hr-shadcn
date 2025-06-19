import PageLayout from "@/layouts/page-layout"
import PlansPage from "@/pages/plans"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_main/plans/")({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageLayout>
            <PlansPage />
        </PageLayout>
    )
}
