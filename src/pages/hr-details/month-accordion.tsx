import Accordion from "@/components/ui/accordion";
import { USER_YEAR_TOTAL_MONTH } from "@/constants/api-endpoints";
import { useGet } from "@/hooks/useGet";
import { Skeleton } from "@heroui/skeleton";
import { Selection } from "@react-types/shared";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import DaysAccordion from "./days-accordion";
import MonthTableHeader from "./month-header";

export default function MonthAccordion() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/_main/hr-view/$id" });
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const search = useSearch({ strict: false });
  const {
    data: info,
    isSuccess,
    isLoading,
  } = useGet<HumanYear[]>(`${USER_YEAR_TOTAL_MONTH}/${id}`, {
    params: { year: (search as any)?.year },
    options: {
      enabled: Boolean((search as any)?.year),
    },
  });

  function clickAccordion(keys: Selection) {
    const selected = Array.from(keys).filter(Boolean) as string[];

    setSelectedKeys(new Set(selected));

    navigate({
      to: "/hr-view/$id",
      params: { id },
      search: (prev) => ({
        ...prev,
        month: selected.join(","),
      }),
    });
  }

  const accordionItems = isLoading
    ? [
        {
          key: "loading",
          title: (
            <div className="grid grid-cols-4 gap-11 px-1">
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
          key: item.month.toString(),
          title: (
            <div className="grid grid-cols-4 gap-11 px-1 ">
              <p className="text-sm">{monthKeys[item.month as any]}</p>
              <p className="text-sm">{item.late_count} marta</p>
              <p className="text-sm">{item.late_duration?.slice(0, 5)}</p>
              <p className="text-sm">{item.fine} so'm</p>
            </div>
          ),
          content: (
            <div className="pl-6">
              <DaysAccordion />
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
            trigger: "!p-0 !px-0 ",
          },
        }}
        items={[
          {
            key: "1",
            title: <MonthTableHeader />,
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
        itemProps={{
          classNames: { trigger: "p-3 dark:bg-zinc-900 bg-zinc-50" },
        }}
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

export const monthKeys: { [key: number]: string } = {
  1: "Yanvar",
  2: "Fevral",
  3: "Mart",
  4: "Aprel",
  5: "May",
  6: "Iyun",
  7: "Iyul",
  8: "Avgust",
  9: "Sentabr",
  10: "Oktabr",
  11: "Noyabr",
  12: "Dekabr",
};
