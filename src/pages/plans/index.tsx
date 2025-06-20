import Private from "@/components/private"
import useCheckPermission from "@/hooks/use-check-permission"
import { useGet } from "@/hooks/useGet"
import { useHistoryCols } from "./cols"
import PlanGraph from "./plan-graph"
import PlanProfile from "./plan-profile"
import { DataTable } from "@/components/ui/datatable"

export default function PlansPage() {
    const { checkAllow } = useCheckPermission()
    const { data } = useGet<ListResponse<PlanHistory>>(
        "common/client-payouts",
        {
            options: {
                enabled: !!checkAllow("balance_history"),
            },
        },
    )
    return (
        <div>
            <PlanProfile />
            <PlanGraph />
            <Private allow={["balance_history"]}>
                <div className="mt-5">
                    <DataTable
                        numeration
                        columns={useHistoryCols()}
                        data={data?.results ?? []}
                        paginationProps={{
                            totalPages: data?.total_pages,
                        }}
                    />
                </div>
            </Private>
        </div>
    )
}
