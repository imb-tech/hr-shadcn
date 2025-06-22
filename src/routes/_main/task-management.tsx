import PageLayout from "@/layouts/page-layout"
import TaskManagment from "@/pages/task-managment"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_main/task-management")({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageLayout>
            <TaskManagment />
        </PageLayout>
    )
}
