import PageLayout from "@/layouts/page-layout"
import TaskBoard from "@/pages/task-managment/project/task-project"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_main/project/")({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageLayout>
            <TaskBoard />
        </PageLayout>
    )
}
