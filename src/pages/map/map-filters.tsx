import { ParamCombobox } from "@/components/as-params/combobox"
import { FILTER } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useSearch } from "@tanstack/react-router"
import { HTMLProps, useMemo } from "react"

interface Props extends HTMLProps<HTMLDivElement> {
    users: UserPoint[] | undefined
}

export default function MapFilters({ users, className, ...rest }: Props) {
    const search = useSearch({ from: "__root__" })
    const { last_company_id, role_id } = search
    const { data: oficeData } = useGet<Filter[]>(FILTER + "office")
    const { data: positions } = useGet<Filter[]>(FILTER + "role", {
        params: { last_company_id },
    })

    const data = useMemo(() => {
        return users?.filter((user) => {
            const matchCompany = last_company_id
                ? user.company == last_company_id
                : true
            const matchRole = role_id ? user.urole_id == role_id : true
            return matchCompany && matchRole
        })
    }, [users, last_company_id, role_id])

    return (
        <div {...rest} className={className}>
            <ParamCombobox
                labelKey="name"
                valueKey="id"
                options={oficeData ?? []}
                asloClear={["role_id", "id"]}
                paramName="last_company_id"
                label="Ofis"
                className="w-full"
            />
            <ParamCombobox
                labelKey="name"
                valueKey="id"
                options={positions ?? []}
                paramName="role_id"
                label="Lavozimlar"
                asloClear={["id"]}
                className="w-full"
            />
            <ParamCombobox
                labelKey="full_name"
                valueKey="id"
                options={data || []}
                paramName={"id"}
                className="w-full"
                label="Hodim"
            />
        </div>
    )
}
