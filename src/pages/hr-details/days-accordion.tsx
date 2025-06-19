import Accordion from "@/components/ui/accordion";
import { USER_YEAR_TOTAL_MONTH_DAYS } from "@/constants/api-endpoints";
import { useGet } from "@/hooks/useGet";
import { Skeleton } from "@heroui/skeleton";
import { Selection } from "@react-types/shared";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { format } from "date-fns";
import { useState } from "react";
import DaysTableHeader from "./days-header";
import OneDaysAccordion from "./one-day-statistic";

export const statusData: { [key: number | string]: string } = {
  0: "Kutilmoqda",
  1: "Qabul qilingan",
  2: "Rad etilgan",
};

export default function DaysAccordion() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/_main/hr-view/$id" });
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const search = useSearch({ strict: false });
  const {
    data: info,
    isSuccess,
    isLoading,
  } = useGet<HumanYear[]>(`${USER_YEAR_TOTAL_MONTH_DAYS}/${id}`, {
    params: { year: (search as any)?.year, month: (search as any)?.month },
    options: {
      enabled: Boolean((search as any)?.month),
    },
  });

  function clickAccordion(keys: Selection) {
    const selected = Array.from(keys).filter(Boolean) as string[];
    setSelectedKeys(new Set(selected));
    const day = new Date(selected.join(",")).getDate();
    const formattedDay = day < 10 ? `0${day}` : `${day}`;

    navigate({
      to: "/hr-view/$id",
      params: { id },
      search: (prev) => ({
        ...prev,
        day: formattedDay,
      }),
    });
  }

  const accordionItems = isLoading
    ? [
        {
          key: "loading",
          title: (
            <div className="grid grid-cols-7 gap-11 px-1">
              <Skeleton className="h-10 rounded-md" />
              <Skeleton className="h-10 rounded-md" />
              <Skeleton className="h-10 rounded-md" />
              <Skeleton className="h-10 rounded-md" />
              <Skeleton className="h-10 rounded-md" />
              <Skeleton className="h-10 rounded-md" />
              <Skeleton className="h-10 rounded-md" />
            </div>
          ),
          content: "",
        },
      ]
    : isSuccess && info.length === 0
      ? [
          {
            key: "empty",
            title: (
              <div className="px-3 text-sm text-zinc-500 text-center">
                Ma'lumot topilmadi
              </div>
            ),
            content: "",
          },
        ]
      : isSuccess &&
        info?.map((item) => ({
          key: item.attendance_time.toString(),
          title: (
            <div className="grid grid-cols-7 gap-11 rounded-b-lg">
              <p className="text-sm">
                {String(new Date(item.attendance_time).getDate()).padStart(
                  2,
                  "0",
                )}
              </p>

              <p className="text-sm">
                {format(new Date(item?.attendance_time), "HH:mm")}
              </p>
              <p className="text-sm">
                {item.late_duration && item.late_duration[0] !== "0"
                  ? "0" + item.late_duration.slice(0, 4)
                  : item.late_duration?.slice(0, 4)}
              </p>
              <p className="text-sm">
                {item.shift_start_time && item.shift_start_time[0] !== "0"
                  ? "0" + item.shift_start_time.slice(0, 4)
                  : item.shift_start_time?.slice(0, 4)}
              </p>
              <p className="text-sm">
                {item.shift_end_time && item.shift_end_time[0] !== "0"
                  ? "0" + item.shift_end_time.slice(0, 4)
                  : item.shift_end_time?.slice(0, 4)}
              </p>
              <p className="text-sm">
                {item.early_checkout && item.early_checkout[0] !== "0"
                  ? "0" + item.early_checkout.slice(0, 4)
                  : item.early_checkout?.slice(0, 4)}
              </p>

              <p className="text-sm">{statusData[item.status]}</p>
            </div>
          ),
          content: (
            <div className="pl-6  ">
              <OneDaysAccordion />
            </div>
          ),
        }));

  return (
    <div>
      <Accordion
        itemProps={{
          classNames: {
            content: "hidden",
            indicator: "hidden",
            trigger: "!p-0 !px-0",
          },
        }}
        items={[
          {
            key: "2",
            title: <DaysTableHeader />,
            content: "hidden",
          },
        ]}
        selectionMode="single"
        style={{
          padding: "0",
        }}
        variant="light"
      />
      <Accordion
        itemProps={{ classNames: { trigger: "p-3 dark:bg-neutral-900 " } }}
        items={accordionItems || []}
        selectedKeys={selectedKeys}
        selectionMode="single"
        style={{
          padding: "0",
        }}
        onSelectionChange={clickAccordion}
      />
    </div>
  );
}
