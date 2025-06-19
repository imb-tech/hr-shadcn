import Accordion from "@/components/ui/accordion";
import DataTable from "@/components/ui/table";
import { USER_STATISTIC } from "@/constants/api-endpoints";
import useCheckPermission from "@/hooks/use-check-permission";
import { useGet } from "@/hooks/useGet";
import { Skeleton } from "@heroui/skeleton";
import { Selection } from "@react-types/shared";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useWorkerInfoCols } from "./cols";
import OfficeInfoRow from "./office-info-row";
import OfficeDetailTableHeader from "./table-header";
type Props = {
  info: CompanyStats[] | undefined;
};

function PositionAccordion({ info }: Props) {
  const { id } = useParams({ from: "/_main/office/$id" });
  const search = useSearch({ from: "/_main/office/$id" });
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const { checkAllow } = useCheckPermission();

  const { data, isSuccess, isLoading } = useGet<WorkerAttendance[]>(
    `${USER_STATISTIC}/${search?.tab}/${id}`,
    {
      options: { enabled: Boolean(id) && Boolean(search?.tab) },
    },
  );

  const clickAccordion = useCallback(
    (keys: Selection) => {
      if (checkAllow("employee_view")) {
        const selectedIds = Array.from(keys)
          .map((key) => info?.[Number(key)]?.id)
          .filter(Boolean);

        setSelectedKeys(keys as Set<string>);

        navigate({
          to: "/office/$id",
          params: { id },
          search: {
            tab: selectedIds.join(","),
          },
        });
      }
    },
    [checkAllow],
  );
  const columns = useWorkerInfoCols();

  return (
    <div>
      {!!info ? (
        <div className="overflow-x-auto hidden lg:block">
          <div className="min-w-[1024px]">
            <Accordion
              itemProps={{
                classNames: {
                  content: "hidden",
                  indicator: "opacity-0",
                  trigger: "!pb-0",
                },
              }}
              items={[
                {
                  key: "1",
                  title: <OfficeDetailTableHeader />,
                  content: null,
                },
              ]}
              selectionMode="single"
              variant="light"
            />
            <Accordion
              itemProps={{ classNames: { trigger: "!px-0 py-1" } }}
              items={info?.map((c, i) => ({
                key: i.toString(),
                title: <OfficeInfoRow data={c} />,
                content: (
                  <DataTable
                    indexing
                    isHeaderSticky
                    columns={columns}
                    data={isSuccess && data.length > 0 ? data : []}
                    isLoading={isLoading}
                    shadow="none"
                    skeletonClassName="h-6 !p-0"
                    skeletonRows={c.total > 15 ? 10 : c.total}
                    onRowClick={(item) =>
                      navigate({
                        to: "/hr-view/$id",
                        params: { id: item.id.toString() },
                      })
                    }
                  />
                ),
              }))}
              selectedKeys={selectedKeys}
              selectionMode="single"
              onSelectionChange={clickAccordion}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center flex-col gap-3 w-full justify-center bg-gray-500/20 rounded-md my-2">
          <Skeleton className="h-8 w-full rounded-md" />
          <Skeleton className="h-8 w-full rounded-md" />
          <Skeleton className="h-8 w-full rounded-md" />
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
      )}
    </div>
  );
}

export default PositionAccordion;
