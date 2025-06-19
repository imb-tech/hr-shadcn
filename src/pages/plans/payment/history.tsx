import { useGet } from "@/hooks/useGet"
import { usHistoryCols } from "./history-cols"
import { DataTable } from "@/components/ui/datatable"

export default function HistoryPage() {
    const { data, isLoading } = useGet<ListResponse<Payment>>("common/orders")
    console.log(data)

    return (
        <DataTable
            loading={isLoading}
            columns={usHistoryCols()}
            data={data?.results ?? []}
            skeletonRowCount={3}
        />
    )
}
