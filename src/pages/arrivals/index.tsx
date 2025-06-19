import ParamPagination from "@/ccomponents/param/pagination";
import ParamSelect from "@/ccomponents/param/param-select";
import { ParamInputSearch } from "@/ccomponents/param/search-input";
import ParamTabs from "@/ccomponents/param/tabs";
import DataTable from "@/components/ui/table";
import Tabs from "@/components/ui/tabs";
import { FILTER, HR_ATTENDED, OFFICE_DETAILS } from "@/constants/api-endpoints";
import { useGet } from "@/hooks/useGet";
import { Card, CardBody } from "@heroui/card";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Grid2x2, Table } from "lucide-react";
import { Key, useMemo, useState } from "react";
import { useArrivalsListCols } from "./cols";
import EmployeeCard from "./employee-card";

type ViewMode = "table" | "card";

const tabs = [
  { key: "table", label: <Table /> },
  { key: "card", label: <Grid2x2 /> },
];

export default function ArrivalsPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const { id, ...otherParams } = search as { id: string; [key: string]: any };
  const [view, setView] = useState<ViewMode>("table");
  const { data: dataPosition } = useGet<Filter[]>(FILTER + "office");

  const { data: dataDetails } = useGet<CompanyStats>(
    `${OFFICE_DETAILS}/${id}`,
    { params: { date: search.date }, options: { enabled: Boolean(id) } },
  );

  const usersInCompany =
    Number(dataDetails?.in_time) + Number(dataDetails?.late);
  const arrivedOnTime = dataDetails?.in_time ?? 0;
  const lateUsers = dataDetails?.late ?? 0;

  const tabOptions = useMemo(
    () => [
      { key: "", label: `Barchasi (${usersInCompany})` },
      { key: "1", label: `Vaqtida kelganlar (${arrivedOnTime})` },
      { key: "0", label: `Kech qolganlar (${lateUsers})` },
    ],
    [dataDetails],
  );

  function handleChange(val: Key) {
    if (val === "table" || val === "card") {
      setView(val);
    }
  }

  const { data, isLoading, isSuccess } = useGet<ListResponse<Human>>(
    `${HR_ATTENDED}/${id}`,
    {
      params: { ...otherParams, page_size: 48 },
      options: { enabled: Boolean(id) },
    },
  );
  const columns = useArrivalsListCols();

  const renderCardView = () => (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 mb-5">
      {data?.results?.map((item, index) => (
        <EmployeeCard
          key={index}
          color={
            item.attendance_status == 1
              ? "bg-green-200 text-green-400"
              : "bg-orange-200 text-orange-300"
          }
          item={item}
          status={
            item.attendance_status == 1 ? "Vaqtida kelgan" : "Kech qolgan"
          }
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
        <>
          {isSuccess && data?.results?.length > 0 ? (
            <div className="space-y-3">
              {renderCardView()}
              {data?.total_pages > 1 && (
                <ParamPagination total={data?.total_pages} />
              )}
            </div>
          ) : (
            <Card>
              <CardBody className="h-72 flex items-center justify-center text-gray-400">
                Ma'lumot topilmadi
              </CardBody>
            </Card>
          )}
        </>
      ) : (
        <>
          <div className="hidden lg:block">
            <DataTable
              indexing
              columns={columns}
              data={data?.results ?? []}
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
