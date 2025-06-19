import ParamPagination from "@/ccomponents/param/pagination";
import ParamSelect from "@/ccomponents/param/param-select";
import { ParamInputSearch } from "@/ccomponents/param/search-input";
import ParamTabs from "@/ccomponents/param/tabs";
import DataTable from "@/components/ui/table";
import Tabs from "@/components/ui/tabs";
import { ALL_EMPLOYEES, FILTER, STATUS_COUNT } from "@/constants/api-endpoints";
import { useGet } from "@/hooks/useGet";
import { Card, CardBody } from "@heroui/card";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Grid2x2, Table } from "lucide-react";
import { Key, useState } from "react";
import EmployeeCard from "../arrivals/employee-card";
import { useAllEmployeesListCols } from "./cols";

type ViewMode = "table" | "card";

const tabs = [
  { key: "table", label: <Table /> },
  { key: "card", label: <Grid2x2 /> },
];

export default function AllEmployeesPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "__root__" });
  const { id, ...otherParams } = search as { id: string; [key: string]: any };
  const [view, setView] = useState<ViewMode>("table");
  const { data: dataPosition } = useGet<Filter[]>(FILTER + "role");
  const { data: statusCount } = useGet<{ true: number; false: number }>(
    `${STATUS_COUNT}/${id}`,
    {
      options: { enabled: Boolean(id) },
    },
  );

  function handleChange(val: Key) {
    if (val === "table" || val === "card") {
      setView(val);
    }
  }

  const {
    data: data,
    isLoading,
    isSuccess,
  } = useGet<ListResponse<Human>>(`${ALL_EMPLOYEES}/${id}`, {
    params: { ...otherParams, page_size: 48 },
    options: { enabled: Boolean(id) },
  });
  const columns = useAllEmployeesListCols();

  const renderCardView = () => (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 mb-5">
      {data?.results?.map((item, index) => (
        <EmployeeCard
          key={index}
          color={
            item.has_attendance
              ? item.attendance_status == 1
                ? "text-green-400 bg-green-200"
                : "text-orange-300 bg-orange-200"
              : item.excuses_status == 1
                ? "text-orange-400 bg-orange-200"
                : "text-red-500 bg-red-200"
          }
          item={item}
          status={
            item.has_attendance
              ? item.attendance_status == 1
                ? "Vaqtida kelgan"
                : "Kech qolgan"
              : item.excuses_status == 1
                ? "Sababli"
                : "Sababsiz"
          }
        />
      ))}
    </div>
  );

  const tabOptions = [
    {
      key: "",
      label: `Barchasi (${Number(Number(statusCount?.true) + Number(statusCount?.false)) || 0})`,
    },
    { key: "1", label: `Kelganlar (${statusCount?.true || 0})` },
    { key: "0", label: `Kelmaganlar (${statusCount?.false || 0})` },
  ];

  return (
    <div>
      <div className="flex justify-between items-center gap-3 w-full mb-3">
        <div>
          <ParamTabs
            clearOther={false}
            paramName="has_attendance"
            tabs={tabOptions}
          />
        </div>
        <div className="hidden lg:block">
          <Tabs
            aria-label="Options"
            tabs={tabs}
            onSelectionChange={handleChange}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 w-full mb-3">
        <ParamInputSearch />
        <ParamSelect
          className="max-w-full"
          optionLabelKey="name"
          optionValueKey="id"
          options={dataPosition}
          paramName="role_id"
          placeholder="Lavozimlar"
        />
      </div>

      {view === "card" ? (
        <div className="space-y-3">
          {isSuccess && data?.results?.length > 0 ? (
            <>
              {renderCardView()}
              {data?.total_pages > 1 && (
                <ParamPagination total={data?.total_pages} />
              )}
            </>
          ) : (
            <Card>
              <CardBody className="h-72 flex items-center justify-center text-gray-400">
                Ma'lumot topilmadi
              </CardBody>
            </Card>
          )}
        </div>
      ) : (
        <>
          <div className="hidden lg:block">
            <DataTable
              indexing
              columns={columns}
              data={data?.results || []}
              isLoading={isLoading}
              onRowClick={(item) =>
                navigate({
                  to: "/hr-view/$id",
                  params: { id: item?.id.toString() },
                })
              }
            />
            {isSuccess && data?.total_pages > 1 ? (
              <ParamPagination total={data?.total_pages} />
            ) : null}
          </div>
          <div className="lg:hidden">{renderCardView()}</div>
        </>
      )}
    </div>
  );
}
