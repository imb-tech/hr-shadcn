import DataTable from "@/components/ui/table";
import { useGet } from "@/hooks/useGet";
import { usHistoryCols } from "./history-cols";

export default function HistoryPage() {
  const { data, isLoading } = useGet<ListResponse<Payment>>("common/orders");
  console.log(data);

  return (
    <DataTable
      isLoading={isLoading}
      indexing
      columns={usHistoryCols()}
      data={data?.results ?? []}
      skeletonRows={3}
    />
  );
}
