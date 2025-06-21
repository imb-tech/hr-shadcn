import { GET_ME } from "@/constants/api-endpoints"
import { useGet } from "./useGet"

const actions: Action[] = [
    "excuse_view",
    "excuse_confirmed",
    "office_view",
    "office_control",
    "map_view",
    "roles_view",
    "roles_control",
    "employee_view",
    "employee_upload",
    "employee_control",
    "employee_download",
    "balance_view",
    "balance_history",
    "balance_top_up",
]

export default function usePermissions() {
    const { data, isLoading } = useGet<Profile>(GET_ME, {
        options: {
            staleTime: Infinity,
        },
    })

    if (isLoading) {
        return { permissions: null, isLoading }
    }

    const permissions: Partial<Record<Action, boolean>> = {}

    if (data?.role === "Owner" || !data?.actions) {
        actions.forEach((action) => {
            permissions[action] = true
        })
    } else {
        data.actions.forEach((element) => {
            if (actions.includes(element)) {
                permissions[element] = true
            }
        })
    }

    return { permissions, isLoading: false }
}
