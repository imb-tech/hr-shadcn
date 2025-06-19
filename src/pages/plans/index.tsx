import Private from "@/components/private";
import DataTable from "@/components/ui/table";
import useCheckPermission from "@/hooks/use-check-permission";
import { useGet } from "@/hooks/useGet";
import { useHistoryCols } from "./cols";
import PlanGraph from "./plan-graph";
import PlanProfile from "./plan-profile";

export default function PlansPage() {
  const { checkAllow } = useCheckPermission();
  const { data } = useGet<ListResponse<PlanHistory>>("common/client-payouts", {
    options: {
      enabled: !!checkAllow("balance_history"),
    },
  });
  return (
    <div>
      <PlanProfile />
      <PlanGraph />
      <Private allow={["balance_history"]}>
        <DataTable
          className="mt-5"
          indexing
          columns={useHistoryCols()}
          data={data?.results ?? []}
        />
      </Private>
    </div>
  );
}
