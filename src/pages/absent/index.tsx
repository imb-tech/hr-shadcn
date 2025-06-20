import { HR_ABSENTS, OFFICE_DETAILS, POSITION } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { Grid2x2, Table } from "lucide-react"
import { useMemo } from "react"
import EmployeeCard from "../arrivals/employee-card"
import { useAbsentListCols } from "./cols"
import ParamTabs from "@/components/as-params/tabs"
import ParamInput from "@/components/as-params/input"
import ParamPagination from "@/components/as-params/pagination"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable } from "@/components/ui/datatable"
import { ParamCombobox } from "@/components/as-params/combobox"

export const tabsParam = [
    { value: "table", label: <Table /> },
    { value: "card", label: <Grid2x2 /> },
]

export default function AbsentPage() {
    const navigate = useNavigate()
    const search: SearchParams = useSearch({ strict: false })
    const { id, tabs, ...otherParams } = search as {
        id: string
        [key: string]: any
    }
    const { data: dataPosition } = useGet<Position[]>(POSITION)

    const { data: dataDetails } = useGet<CompanyStats>(
        `${OFFICE_DETAILS}/${id}`,
        { params: { date: search?.date }, options: { enabled: Boolean(id) } },
    )

    const absentUsers =
        Number(dataDetails?.excused) + Number(dataDetails?.absent)
    const absentWithReason = dataDetails?.excused ?? 0
    const absentWithoutReason = dataDetails?.absent ?? 0

    const tabOptions = useMemo(
        () => [
            { value: "", label: `Barchasi (${absentUsers})` },
            { value: "1", label: `Sababli (${absentWithReason})` },
            { value: "0", label: `Sababsiz (${absentWithoutReason})` },
        ],
        [dataDetails],
    )

    const {
        data: data,
        isLoading,
        isSuccess,
    } = useGet<ListResponse<Human>>(`${HR_ABSENTS}/${id}`, {
        params: { ...otherParams, page_size: 25 },
        options: { enabled: Boolean(id) },
    })
    const columns = useAbsentListCols()

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
    )

    return (
        <div>
            <div className="flex justify-between items-center gap-3 w-full mb-3">
                <div>
                    <ParamTabs paramName="status" options={tabOptions} />
                </div>
                <div className="hidden lg:block">
                    <ParamTabs paramName="tabs" options={tabsParam} />
                </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 w-full mb-3">
                <ParamInput fullWidth  />
                <ParamCombobox
                    className="max-w-full w-full  sm:w-1/3"
                    labelKey="name"
                    valueKey="id"
                    options={dataPosition || []}
                    paramName="role_id"
                    label="Lavozimlar"
                />
            </div>

            {search?.tabs === "card" ? (
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
                            numeration
                        />
                    </div>
                    <div className="lg:hidden">{renderCardView()}</div>
                </>
            )}
        </div>
    )
}
