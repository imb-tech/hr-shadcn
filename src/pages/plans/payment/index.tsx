import DataTable from "@/components/ui/table";
import { PAYMENTS_USERS_MONTH } from "@/constants/api-endpoints";
import { useGet } from "@/hooks/useGet";
import { formatMoney } from "@/lib/format-money";
import { useMonthStore } from "@/store/mont-ids";
import { useUsersStore } from "@/store/user-ids";
import { cn } from "@heroui/theme";
import { useNavigate, useSearch } from "@tanstack/react-router";
import PaymentSummary, { months } from "./payment-summary";
import { usUsersCols } from "./user-cols";

export interface UsersType {
  id: number;
  position: string;
  full_name: string;
  status: boolean;
}
export const tariffPrices: Record<number, number> = {
  1: 4000,
  2: 6000,
  3: 12000,
};

export default function PaymentPage() {
  const { usersId } = useUsersStore();
  const { months: vals } = useMonthStore();
  const nvg = useNavigate();
  const search: SearchParams = useSearch({ from: "__root__" });
  const monthId = search.month;
  const { data } = useGet<UsersType[]>(PAYMENTS_USERS_MONTH, {
    params: { month: monthId, users: usersId },
  });

  const total = data
    ?.filter((item) => item.status === false)
    .reduce((sum) => sum + (tariffPrices[Number(search?.plan_id)] || 0), 0);

  function handleChange(evnt: string | undefined) {
    nvg({
      to: location.pathname,
      search: {
        ...search,
        month: evnt ? evnt?.toString() : undefined,
      },
    });
  }

  return (
    <div className="grid grid-cols-2 items-start gap-3">
      <PaymentSummary />
      <div className="space-y-3">
        {vals.length ? (
          <ul className="grid grid-cols-6 dark:bg-zinc-900 bg-gray-100 p-2 rounded-md gap-2 mb-3">
            {months
              .filter((month) => vals.includes(month.key))
              .map((m) => (
                <li
                  key={m.key}
                  className={cn(
                    "p-3 bg-gray-400/10 rounded-md cursor-pointer text-center select-none transition-all duration-150 relative",
                    monthId === m.key ? "bg-primary " : "",
                  )}
                  onClick={() => handleChange(m.key)}
                >
                  {m.name}
                </li>
              ))}
          </ul>
        ) : null}

        <div className="flex items-center gap-3 justify-between dark:bg-zinc-900 bg-gray-100 py-3 px-4 rounded-lg">
          <h1>Aktiv va Aktivmas hodimlar</h1>
          <h1>Jami : {formatMoney(total)} so'm</h1>
        </div>
        <DataTable indexing columns={usUsersCols(tariffPrices[Number(search?.plan_id)] || 0)} data={data || []} />
      </div>
    </div>
  );
}
