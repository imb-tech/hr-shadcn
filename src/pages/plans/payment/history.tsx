import { useGet } from "@/hooks/useGet"
import { usHistoryCols } from "./history-cols"
import { DataTable } from "@/components/ui/datatable"

export default function HistoryPage() {
    const { data, isLoading } = useGet<ListResponse<Payment>>("common/orders")

    return (
        <DataTable
            numeration
            loading={isLoading}
            columns={usHistoryCols()}
            data={data?.results ?? []}
            skeletonRowCount={3}
            paginationProps={{totalPages:data?.total_pages}}
        />
    )
}
