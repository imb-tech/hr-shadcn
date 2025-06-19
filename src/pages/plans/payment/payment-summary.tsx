import {
  PAYMENTS,
  PAYMENTS_USERS_MONTH_PRICE,
  POSITION_USERS,
} from "@/constants/api-endpoints";
import { useGet } from "@/hooks/useGet";
import { usePost } from "@/hooks/usePost";
import { formatMoney } from "@/lib/format-money";
import { useMonthStore } from "@/store/mont-ids";
import { useUsersStore } from "@/store/user-ids";
import { Card, CardBody } from "@heroui/card";
import { addToast, Button, Chip } from "@heroui/react";
import { cn } from "@heroui/theme";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Circle, CircleCheckBig, Crown } from "lucide-react";

export default function PaymentSummary() {
  const queryClinet = useQueryClient();
  const { months: vals, setMonths, resetMonths } = useMonthStore();
  const current = new Date().getMonth() + 1;
  const navigate = useNavigate();
  const search: SearchParams = useSearch({ from: "__root__" });
  const { usersId, clearUsersId } = useUsersStore();
  const { data } = useGet<{ total_amount: number }>(
    PAYMENTS_USERS_MONTH_PRICE,
    {
      params: { months: vals, users: usersId, plan: search.plan_id },
    },
  );
  const { mutate, isPending } = usePost({
    onSuccess: () => {
      resetMonths();
      clearUsersId();
      addToast({
        description: "Muvaffaqiyatli",
        color: "success",
      });
      navigate({ to: "/plans" });
      queryClinet.invalidateQueries({ queryKey: [POSITION_USERS] });
    },
  });

  function handleChange(v: string) {
    if (current > Number(v)) {
      return;
    }

    if (vals.includes(v)) {
      setMonths((prev) => prev.filter((t) => t !== v));
    } else {
      setMonths((prev) => [...prev, v]);
    }
  }

  const onSubmit = () => {
    const data = {
      plan: search.plan_id,
      users: usersId,
      months: vals,
    };
    mutate(PAYMENTS, data);
  };

  return (
    <Card className="p-2 shadow-sm light:border-small ">
      <CardBody>
        <h1 className="mb-3">Obuna muddati</h1>
        <ul className="grid grid-cols-6 gap-2 mb-5">
          {months?.map((m) => (
            <li
              key={m.key}
              className={cn(
                "p-3 bg-gray-400/10 rounded-md cursor-pointer text-center select-none transition-all duration-150 relative",
                vals.includes(m.key) ? "bg-primary " : "",
                current > Number(m.key)
                  ? "bg-transparent border dark:border-zinc-800"
                  : "",
              )}
              onClick={() => handleChange(m.key)}
            >
              {m.name}
              <span className="absolute top-1 right-1">
                {current > Number(m.key) ? (
                  ""
                ) : vals.includes(m.key) ? (
                  <CircleCheckBig size={14} className="opacity-70" />
                ) : (
                  <Circle size={14} className="opacity-50" />
                )}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between p-3 bg-gray-400/10 rounded-md">
          <h1 className="text-2xl">{formatMoney(data?.total_amount)} so'm</h1>

          <Chip
            color="secondary"
            startContent={<Crown size={15} />}
            variant="flat"
            className="px-2"
          >
            Premium x20
          </Chip>
        </div>

        <Button
          onPress={onSubmit}
          disabled={isPending}
          isLoading={isPending}
          color="primary"
          variant="solid"
          className="mt-4 rounded-md"
        >
          To'lov qilish
        </Button>
      </CardBody>
    </Card>
  );
}

export const months = [
  { key: "01", name: "Yanvar" },
  { key: "02", name: "Fevral" },
  { key: "03", name: "Mart" },
  { key: "04", name: "Aprel" },
  { key: "05", name: "May" },
  { key: "06", name: "Iyun" },
  { key: "07", name: "Iyul" },
  { key: "08", name: "Avgust" },
  { key: "09", name: "Sentabr" },
  { key: "10", name: "Oktabr" },
  { key: "11", name: "Noyabr" },
  { key: "12", name: "Dekabr" },
];
