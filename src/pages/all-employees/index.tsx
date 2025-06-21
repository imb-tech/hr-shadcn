import { ALL_EMPLOYEES, FILTER, STATUS_COUNT } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useNavigate, useSearch } from "@tanstack/react-router"
import EmployeeCard from "../arrivals/employee-card"
import { useAllEmployeesListCols } from "./cols"
import ParamTabs from "@/components/as-params/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable } from "@/components/ui/datatable"
import ParamPagination from "@/components/as-params/pagination"
import ParamInput from "@/components/as-params/input"
import { ParamCombobox } from "@/components/as-params/combobox"
import { tabsParam } from "../absent"

export default function AllEmployeesPage() {
    const navigate = useNavigate()
    const search: SearchParams = useSearch({ from: "__root__" })
    const { id, tabs, ...otherParams } = search as {
        id: string
        [key: string]: any
    }
    const { data: dataPosition } = useGet<Filter[]>(FILTER + "role")
    const { data: statusCount } = useGet<{ true: number; false: number }>(
        `${STATUS_COUNT}/${id}`,
        {
            options: { enabled: Boolean(id) },
        },
    )

    const {
        data: data,
        isLoading,
        isSuccess,
    } = useGet<ListResponse<Human>>(`${ALL_EMPLOYEES}/${id}`, {
        params: { ...otherParams, page_size: 25 },
        options: { enabled: Boolean(id) },
    })
    const columns = useAllEmployeesListCols()

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
    )

    const tabOptions = [
        {
            value: "",
            label: `Barchasi (${
                Number(
                    Number(statusCount?.true) + Number(statusCount?.false),
                ) || 0
            })`,
        },
        { value: "1", label: `Kelganlar (${statusCount?.true || 0})` },
        { value: "0", label: `Kelmaganlar (${statusCount?.false || 0})` },
    ]

    return (
        <div>
            <div className="flex justify-between items-center gap-3 w-full mb-3">
                <div>
                    <ParamTabs
                        paramName="has_attendance"
                        options={tabOptions}
                    />
                </div>
                <div className="hidden lg:block">
                    <ParamTabs paramName="tabs" options={tabsParam} />
                </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 w-full mb-3">
                <ParamInput fullWidth  />
                <ParamCombobox
                    className="max-w-full w-full   sm:w-1/3"
                    labelKey="name"
                    valueKey="id"
                    options={dataPosition || []}
                    paramName="role_id"
                    label="Lavozimlar"
                />
            </div>

            {search.tabs === "card" ? (
                <div className="space-y-3">
                    {isSuccess && data?.results?.length > 0 ? (
                        <>
                            {renderCardView()}
                            {data?.total_pages > 1 && (
                                <ParamPagination
                                    totalPages={data?.total_pages}
                                />
                            )}
                        </>
                    ) : (
                        <Card>
                            <CardContent className="h-72 flex items-center justify-center text-gray-400">
                                Ma'lumot topilmadi
                            </CardContent>
                        </Card>
                    )}
                </div>
            ) : (
                <>
                    <div className="hidden lg:block">
                        <DataTable
                            numeration
                            columns={columns}
                            data={data?.results || []}
                            loading={isLoading}
                            onRowClick={(item) =>
                                navigate({
                                    to: "/hr-view/$id",
                                    params: { id: item?.id.toString() },
                                })
                            }
                            paginationProps={{
                                totalPages: data?.total_pages,
                            }}
                        />
                    </div>
                    <div className="lg:hidden">{renderCardView()}</div>
                </>
            )}
        </div>
    )
}
