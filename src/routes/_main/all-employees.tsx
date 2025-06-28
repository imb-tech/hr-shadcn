import { Button } from "@/components/ui/button"
import PageLayout from "@/layouts/page-layout"
import AllEmployeesPage from "@/pages/all-employees"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { useTranslation } from "react-i18next"

export const Route = createFileRoute("/_main/all-employees")({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <PageLayout>
            <div className="flex items-center gap-3 mb-3">
                <Button
                    className="min-w-4"
                    onClick={() =>
                        navigate({
                            to: "/",
                        })
                    }
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-xl font-semibold">
                    {t("Hodimlar ro'yxati")}
                </h1>
            </div>
            <AllEmployeesPage />
        </PageLayout>
    )
}
