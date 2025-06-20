import PButton from "@/components/ui/p-button"
import { useStore } from "@/hooks/use-store"
import { useModal } from "@/hooks/useModal"
import PageLayout from "@/layouts/page-layout"
import PostionsPage from "@/pages/position"
import { createFileRoute } from "@tanstack/react-router"
import { Plus } from "lucide-react"

export const Route = createFileRoute("/_main/roles/")({
    component: RouteComponent,
})

function RouteComponent() {


    return (
        <PageLayout
        >
            <PostionsPage />
        </PageLayout>
    )
}
