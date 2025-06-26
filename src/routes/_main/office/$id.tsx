import ParamDatePicker from "@/components/as-params/date-picker"
import ExportAsExcel from "@/components/custom/export-excel"
import { HR_EXCEL_DOWN } from "@/constants/api-endpoints"
import PageLayout from "@/layouts/page-layout"
import OfficeDetail from "@/pages/office-detail"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_main/office/$id")({
    component: RouteComponent,
    validateSearch: (s: { tab?: string }) => s,
})

function RouteComponent() {
    return (
        <PageLayout
            rightComponent={
                <div className="flex gap-2 items-center">
                    <ExportAsExcel
                        url="hr/daily-excel-report"
                        name="hodimlar_davomati"
                        inputDate
                    />
                    <ParamDatePicker
                        titleHidden={false}
                        className="!text-primary sm:block hidden"
                        variant="default"
                    />
                </div>
            }
        >
            <ParamDatePicker
                className="!text-primary sm:hidden"
                variant="default"
            />
            <OfficeDetail />
        </PageLayout>
    )
}
