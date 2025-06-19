import ParamPagination from "@/components/param/pagination";
import ParamSelect from "@/components/param/param-select";
import { ParamInputSearch } from "@/components/param/search-input";
import ParamTabs from "@/components/param/tabs";
import DataTable from "@/components/ui/table";
import Tabs from "@/components/ui/tabs";
import {
  HR_ABSENTS,
  OFFICE_DETAILS,
  POSITION,
} from "@/constants/api-endpoints";
import { useGet } from "@/hooks/useGet";
import { Card, CardBody } from "@heroui/card";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Grid2x2, Table } from "lucide-react";
import { Key, useMemo, useState } from "react";
import EmployeeCard from "../arrivals/employee-card";
import { useAbsentListCols } from "./cols";

export type ViewMode = "table" | "card";

export const tabs = [
  { key: "table", label: <Table /> },
  { key: "card", label: <Grid2x2 /> },
];

export default function AbsentPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const { id, ...otherParams } = search as { id: string; [key: string]: any };
  const [view, setView] = useState<ViewMode>("table");
  const { data: dataPosition } = useGet<Position[]>(POSITION);

  const { data: dataDetails } = useGet<CompanyStats>(
    `${OFFICE_DETAILS}/${id}`,
    { params: { date: search.date }, options: { enabled: Boolean(id) } },
  );

  const absentUsers =
    Number(dataDetails?.excused) + Number(dataDetails?.absent);
  const absentWithReason = dataDetails?.excused ?? 0;
  const absentWithoutReason = dataDetails?.absent ?? 0;

  const tabOptions = useMemo(
    () => [
      { key: "", label: `Barchasi (${absentUsers})` },
      { key: "1", label: `Sababli (${absentWithReason})` },
      { key: "0", label: `Sababsiz (${absentWithoutReason})` },
    ],
    [dataDetails],
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
  } = useGet<ListResponse<Human>>(`${HR_ABSENTS}/${id}`, {
    params: { ...otherParams, page_size: 48 },
    options: { enabled: Boolean(id) },
  });
  const columns = useAbsentListCols();

  const renderCardView = () => (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 mb-5">
      {data?.results?.map((item, index) => (
        <EmployeeCard
          key={index}
          color={
            item.excuses_status == 1
              ? "bg-orange-200 text-orange-400"
              : "bg-red-200 text-red-600"
          }
          item={item}
          status={item.excuses_status == 1 ? "Sababli" : "Sababsiz"}
        />
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center gap-3 w-full mb-3">
        <div>
          <ParamTabs clearOther={false} paramName="status" tabs={tabOptions} />
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
