import { ParamCombobox } from "@/components/as-params/combobox"
import { FILTER } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useSearch } from "@tanstack/react-router"
import { HTMLProps } from "react"

export default function MapFilters(props: HTMLProps<HTMLDivElement>) {
    const search = useSearch({ from: "__root__" })
    const { role_id, last_company_id } = search
    const { data: oficeData } = useGet<Filter[]>(FILTER + "office")
    const { data: positions } = useGet<Filter[]>(FILTER + "role", {
        params: { last_company_id },
    })
    const { data: users } = useGet<Filter[]>(FILTER + "user", {
        params: { role_id, last_company_id },
    })

    return (
        <div {...props}>
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
                labelKey="name"
                valueKey="id"
                options={
                    users?.map((usr) => ({
                        id: usr.id,
                        name: usr?.first_name + " " + usr?.last_name,
                    })) ?? []
                }
                paramName={"id"}
                className="w-full"
                label="Hodim"
            />
        </div>
    )
}
