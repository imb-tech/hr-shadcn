import { ParamCombobox } from "@/components/as-params/combobox"
import ParamInput from "@/components/as-params/input"
import { HR_API, POSITION } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useState } from "react"

export default function TaskHeader() {
    const [searchCustomer, setCustomerSearch] = useState("")
    const { data: dataPosition } = useGet<Position[]>(POSITION)
    const { data: dataCustomer } = useGet<ListResponse<Human>>(HR_API, {
        params: { search: searchCustomer, page_size: 50 },
    })
    return (
        <div className="grid sm:grid-cols-3 gap-3">
            <ParamCombobox
                className="w-full "
                labelKey="name"
                valueKey="id"
                options={dataPosition || []}
                paramName="role_id"
                label="Lavozimlar"
            />
            <ParamCombobox
                labelKey="full_name"
                valueKey="id"
                options={dataCustomer?.results || []}
                paramName={"id"}
                className="w-full"
                label="Hodim"
                onSearchChange={(val) => setCustomerSearch(val)}
            />
            <ParamInput fullWidth />
        </div>
    )
}
