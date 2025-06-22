import ParamDatePicker from "@/components/as-params/date-picker"
import { GET_ME } from "@/constants/api-endpoints"
import PageLayout from "@/layouts/page-layout"
import OfficeDetail from "@/pages/office-detail"
import axiosInstance from "@/services/axios-instance"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_main/office/")({
    beforeLoad: async () => {
        const response = await axiosInstance.get<{ office_id?: number }>(GET_ME)
        const me = response.data

        const defaultOfficeId = me?.office_id?.toString() || "1234567"

        if (me?.office_id) {
            throw redirect({
                to: "/office/$id",
                params: { id: defaultOfficeId },
            })
        }

        throw redirect({
            to: "/office/$id",
            params: { id: "1234567" },
        })
    },
    component: () => (
        <PageLayout
            rightComponent={
                <ParamDatePicker
                    titleHidden={false}
                    className="!text-primary"
                    variant="default"
                />
            }
        >
            <OfficeDetail />
        </PageLayout>
    ),
})
