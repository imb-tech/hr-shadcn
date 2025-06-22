import { FILTER, HR_ATTENDED, OFFICE_DETAILS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useMemo } from "react"
import { useArrivalsListCols } from "./cols"
import EmployeeCard from "./employee-card"
import ParamTabs from "@/components/as-params/tabs"
import { tabsParam } from "../absent"
import ParamInput from "@/components/as-params/input"
import { ParamCombobox } from "@/components/as-params/combobox"
import ParamPagination from "@/components/as-params/pagination"
import { DataTable } from "@/components/ui/datatable"
import EmptyBox from "@/components/custom/empty-box"

export default function ArrivalsPage() {
    const navigate = useNavigate()
    const search: SearchParams = useSearch({ strict: false })
    const { id, tabs, ...otherParams } = search as {
        id: string
        [key: string]: any
    }
    const { data: dataPosition } = useGet<Filter[]>(FILTER + "office")

    const { data: dataDetails } = useGet<CompanyStats>(
        `${OFFICE_DETAILS}/${id}`,
        { params: { date: search.date }, options: { enabled: Boolean(id) } },
    )

    const usersInCompany =
        Number(dataDetails?.in_time) + Number(dataDetails?.late)
    const arrivedOnTime = dataDetails?.in_time ?? 0
    const lateUsers = dataDetails?.late ?? 0

    const tabOptions = useMemo(
        () => [
            { value: "", label: `Barchasi (${usersInCompany})` },
            { value: "1", label: `Vaqtida kelganlar (${arrivedOnTime})` },
            { value: "0", label: `Kech qolganlar (${lateUsers})` },
        ],
        [dataDetails],
    )

    const { data, isLoading, isSuccess } = useGet<ListResponse<Human>>(
        `${HR_ATTENDED}/${id}`,
        {
            params: { ...otherParams, page_size: search?.page_size || 25 },
            options: { enabled: Boolean(id) },
        },
    )
    const columns = useArrivalsListCols()

    const renderCardView = () => (
        <div className="grid 2xl:lg:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 mb-5">
            {isSuccess &&
                !!data?.results?.length &&
                data?.results?.map((item, index) => (
                    <EmployeeCard
                        key={index}
                        color={
                            item.attendance_status == 1
                                ? "bg-green-200 text-green-400"
                                : "bg-orange-200 text-orange-300"
                        }
                        item={item}
                        status={
                            item.attendance_status == 1
                                ? "Vaqtida kelgan"
                                : "Kech qolgan"
                        }
                    />
                ))}

            {isLoading &&
                Array.from({ length: 12 }).map((_, index) => (
                    <EmployeeCard key={index} />
                ))}
        </div>
    )

    return (
        <div>
            <div className="flex justify-between items-center gap-3 w-full mb-3">
                <div className="max-w-[760px] overflow-x-auto no-scrollbar-x">
                    <ParamTabs paramName="status" options={tabOptions} />
                </div>
                <div className="hidden lg:block">
                    <ParamTabs paramName="tabs" options={tabsParam} />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 w-full mb-3">
                <ParamInput fullWidth />
                <ParamCombobox
                    className="max-w-full w-full  sm:w-1/3"
                    labelKey="name"
                    valueKey="id"
                    options={dataPosition || []}
                    paramName="role_id"
                    label="Lavozimlar"
                />
            </div>

            {search.tabs === "card" ? (
                <div className="space-y-3">
                    {renderCardView()}

                    {isSuccess && !!data?.results?.length && (
                        <ParamPagination totalPages={data?.total_pages} />
                    )}
                    {isSuccess && data?.results?.length == 0 && (
                        <div className="bg-card rounded-md">
                            <EmptyBox />
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <div className="hidden lg:block">
                        <DataTable
                            numeration
                            columns={columns}
                            data={data?.results ?? []}
                            loading={isLoading}
                            paginationProps={{
                                totalPages: data?.total_pages,
                            }}
                            onRowClick={(item) =>
                                navigate({
                                    to: "/hr-view/$id",
                                    params: { id: item?.id.toString() },
                                })
                            }
                        />
                    </div>
                    <div className="lg:hidden space-y-3">
                        {renderCardView()}
                        {isSuccess && !!data?.results?.length && (
                            <ParamPagination totalPages={data?.total_pages} />
                        )}
                        {isSuccess && data?.results?.length == 0 && (
                            <div className="bg-card rounded-md">
                                <EmptyBox />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
