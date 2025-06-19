import PageLayout from "@/layouts/page-layout"
import MapPage from "@/pages/map"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_main/map/")({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageLayout>
            <MapPage />
        </PageLayout>
    )
}
