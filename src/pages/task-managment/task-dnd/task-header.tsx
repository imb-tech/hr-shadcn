import ParamInput from "@/components/as-params/input"
import { ParamMultiCombobox } from "@/components/as-params/multi-combobox"
import { HR_API, POSITION } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useSearch } from "@tanstack/react-router"
import { useState } from "react"

export default function TaskHeader() {
    const search = useSearch({ from: "/_main/project/$id" })
    const [searchCustomer, setCustomerSearch] = useState("")
    const { data: dataPosition } = useGet<Position[]>(POSITION)
    const { data: dataCustomer } = useGet<ListResponse<Human>>(HR_API, {
        params: {
            search: searchCustomer,
            page_size: 50,
            role_id: search?.role_id,
        },
    })
    return (
        <div className="grid sm:grid-cols-3 gap-3">
            <ParamMultiCombobox
                className="w-full "
                labelKey="name"
                valueKey="id"
                options={dataPosition || []}
                paramName="role_id"
                label="Lavozimlar"
            />
            <ParamMultiCombobox
                labelKey="full_name"
                valueKey="id"
                options={dataCustomer?.results || []}
                paramName={"user_id"}
                className="w-full"
                label="Hodim"
                onSearchChange={(val) => setCustomerSearch(val)}
            />
            <ParamInput fullWidth />
        </div>
    )
}
