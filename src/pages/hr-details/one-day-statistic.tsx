import { USER_YEAR_TOTAL_MONTH_DAYS_ONE } from "@/constants/api-endpoints";
import { useGet } from "@/hooks/useGet";
import { Skeleton } from "@heroui/skeleton";
import { useParams, useSearch } from "@tanstack/react-router";
import { statusData } from "./days-accordion";
export default function OneDaysAccordion() {
  const { id } = useParams({ from: "/_main/hr-view/$id" });
  const search = useSearch({ strict: false });
  const params = `${(search as any)?.year}-${(search as any)?.month > 9 ? (search as any)?.month : "0" + (search as any)?.month}-${(search as any)?.day}`;
  const {
    data: info,
    isSuccess,
    isLoading,
  } = useGet<
    { first_time: string; second_time: string; status: string | number }[]
  >(`${USER_YEAR_TOTAL_MONTH_DAYS_ONE}/${id}`, {
    params: { date: params },
    options: {
      enabled: !isNaN((search as any)?.day),
    },
  });

  console.log((search as any)?.day, !isNaN((search as any)?.day));
  
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 bg-foreground-100 p-3 text-foreground-500 rounded-t-lg">
        <p className="text-sm">Kelish va Ketish vaqti</p>
        <p className="text-sm">Qayerda</p>
      </div>
      <div className="px-3 dark:bg-zinc-900 bg-zinc-50 rounded-b-lg ">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-5 py-3 border-b dark:border-b-zinc-700">
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
          </div>
        ) : isSuccess && info.length === 0 ? (
          <div className="p-3 text-sm text-zinc-500 text-center">
            Ma'lumot topilmadi
          </div>
        ) : (
          info?.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-2 gap-5 py-3 border-b dark:border-b-zinc-700"
            >
              <p className="text-sm">
                {item.first_time} - {item.second_time}
              </p>
              <div className="text-sm flex items-center gap-3">
                <p>{statusData[item.status]}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
