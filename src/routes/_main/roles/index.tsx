import PageLayout from "@/layouts/page-layout"
import PostionsPage from "@/pages/position"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_main/roles/")({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageLayout>
            <PostionsPage />
        </PageLayout>
    )
}
