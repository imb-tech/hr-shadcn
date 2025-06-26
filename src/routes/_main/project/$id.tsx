import {  TASKLY_PROJECT } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import PageLayout from "@/layouts/page-layout"
import TaskManagment from "@/pages/task-managment/task-board"
import { createFileRoute, useParams } from "@tanstack/react-router"

export const Route = createFileRoute("/_main/project/$id")({
    component: RouteComponent,
})

function RouteComponent() {
    const params = useParams({ from: "/_main/project/$id" })
    const { data } = useGet<{
        background: string
    }>(`${TASKLY_PROJECT}/${params?.id}`, {
        options: { enabled: !!params?.id },
    })

    return (
        <PageLayout
            className={"bg-cover bg-center overflow-x-auto !overflow-y-hidden "}
            style={{
                backgroundImage: `url(${data?.background})`,
            }}
        >
            <TaskManagment />
        </PageLayout>
    )
}
