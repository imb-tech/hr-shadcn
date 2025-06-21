import { COMPANIES, GET_ME } from "@/constants/api-endpoints"
import usePermissions from "@/hooks/use-permissions"
import { useGet } from "@/hooks/useGet"
import usePath from "@/hooks/usePath"
import OfficeDetail from "@/pages/office-detail"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"

export const Route = createFileRoute("/_main/")({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()
    const { links } = usePath()
    const { permissions } = usePermissions()
    const { data, isLoading } = useGet<{ office_id?: number }>(GET_ME, {
        options: {
            enabled: !!permissions?.office_view,
        },
    })

    useEffect(() => {
        if (data) {
            const url = links.find((us) => us.enabled)

            if (url?.to !== "/") {
                navigate({
                    to: url?.to as string,
                })
            } else if (data?.office_id) {
                navigate({
                    to: "/office/$id",
                    params: { id: data?.office_id?.toString() },
                })
            } else {
                navigate({
                    to: "/office/$id",
                    params: { id: "1234567" },
                })
            }
        }
    }, [data])

    return (
        <div className=" p-6 rounded-md max-auto">
            {isLoading ? <OfficeDetail /> : null}
        </div>
    )
}
