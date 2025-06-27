import ParamInput from "@/components/as-params/input"
import { ParamMultiCombobox } from "@/components/as-params/multi-combobox"
import { Button } from "@/components/ui/button"
import { FILTER } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useNavigate, useParams, useSearch } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"

export default function TaskHeader() {
    const navigate = useNavigate()
    const params = useParams({ from: "/_main/project/$id" })
    const search = useSearch({ from: "/_main/project/$id" })
    const { data: dataPosition } = useGet<Position[]>(`${FILTER}role`, {
        params: {
            users__user_tasks__status__project_id: params?.id,
        },
        options: {
            enabled: !!params?.id,
        },
    })
    const { data: dataCustomer } = useGet<Human[]>(`${FILTER}user`, {
        params: {
            role_id: search?.role_id,
            user_tasks__status__project_id: params?.id,
        },
        options: {
            enabled: !!params?.id,
        },
    })
    return (
        <div className="grid sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3">
                <Button
                    className="min-w-4"
                    variant={"secondary"}
                    onClick={() =>
                        navigate({
                            to: "/project",
                        })
                    }
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <ParamMultiCombobox
                    className="w-full "
                    labelKey="name"
                    valueKey="id"
                    options={dataPosition || []}
                    paramName="role_id"
                    label="Lavozimlar"
                />
            </div>
            <ParamMultiCombobox
                labelKey="full_name"
                valueKey="id"
                options={
                    dataCustomer?.map((item) => ({
                        id: item.id,
                        full_name: `${item.first_name} ${item.last_name}`,
                    })) || []
                }
                paramName={"user_id"}
                className="w-full"
                label="Hodim"
            />
            <ParamInput fullWidth />
        </div>
    )
}
