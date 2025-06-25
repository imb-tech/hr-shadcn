import PageLayout from "@/layouts/page-layout"
import TaskManagment from "@/pages/task-managment/task-board"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_main/project/$id")({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageLayout>
            <TaskManagment />
        </PageLayout>
    )
}
