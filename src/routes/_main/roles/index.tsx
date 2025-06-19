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
    const { openModal } = useModal()
    const { remove } = useStore<Position>("position-data")

    function handleClick() {
        remove()
        openModal()
    }

    return (
        <PageLayout
            rightComponent={
                <PButton
                    allow={["roles_control"]}
                    className="flex gap-1"
                    onClick={handleClick}
                >
                    <Plus className="w-5 h-5" />
                    Lavozim qo'shish
                </PButton>
            }
        >
            <PostionsPage />
        </PageLayout>
    )
}
