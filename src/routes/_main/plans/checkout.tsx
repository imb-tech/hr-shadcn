import { Button } from "@/components/ui/button"
import PageLayout from "@/layouts/page-layout"
import HistoryPage from "@/pages/plans/payment/history"
import PaymentForm from "@/pages/plans/payment/payment-form"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"

export const Route = createFileRoute("/_main/plans/checkout")({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()
    return (
        <PageLayout breadcrumb={["To'lovlar"]}>
            <div>
                <Button
                    className="min-w-4"
                    variant="default"
                    onClick={() => navigate({ to: "/plans" })}
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
            </div>
            <div className="max-w-3xl mx-auto ">
                <PaymentForm />
            </div>
            <div className="sm:mt-24 mt-8">
                <h1 className="text-xl  mb-3">To'lovlar tarixi</h1>
                <HistoryPage />
            </div>
        </PageLayout>
    )
}
