import { USER_STATISTIC } from "@/constants/api-endpoints"
import useCheckPermission from "@/hooks/use-check-permission"
import { useGet } from "@/hooks/useGet"
import { useNavigate, useParams, useSearch } from "@tanstack/react-router"
import { useCallback } from "react"
import { useWorkerInfoCols } from "./cols"
import OfficeInfoRow from "./office-info-row"
import OfficeDetailTableHeader from "./table-header"
import AccordionSkeletion from "@/components/custom/accordion-skeletion"
import { DataTable } from "@/components/ui/datatable"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
type Props = {
    info: CompanyStats[] | undefined
    loading: boolean
}

function PositionAccordion({ info, loading }: Props) {
    const { id } = useParams({ strict: false }) as { id: string }
    const search = useSearch({ strict: false })
    const navigate = useNavigate()

    const { checkAllow } = useCheckPermission()

    const { data, isSuccess, isLoading } = useGet<WorkerAttendance[]>(
        `${USER_STATISTIC}/${search?.tab}/${id}`,
        {
            options: { enabled: Boolean(id) && Boolean(search?.tab) },
        },
    )
    const clickAccordion = useCallback(
        (key: string) => {
            if (checkAllow("employee_view")) {
                navigate({
                    to: "/office/$id",
                    params: { id },
                    search: {
                        tab: search.tab === key ? undefined : key,
                    },
                })
            }
        },
        [checkAllow, navigate, id, search.tab],
    )
    const columns = useWorkerInfoCols()

    return (
        <div className="overflow-x-auto hidden lg:block">
            <div className="p-3 min-w-[1024px]">
                <OfficeDetailTableHeader />
                {loading && (
                   <div className="mt-3">
                     <AccordionSkeletion columnCount={6} rowCount={4} />
                   </div>
                )}
                {info?.map((item, index) => (
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        value={search?.tab ?? undefined}
                        onValueChange={(val) => {
                            clickAccordion(val)
                        }}
                    >
                        <AccordionItem value={item.id.toString()}>
                            <AccordionTrigger>
                                <OfficeInfoRow data={item} key={index} />
                            </AccordionTrigger>
                            <AccordionContent className="flex  flex-col gap-4 text-balance">
                                <DataTable
                                    numeration
                                    columns={columns}
                                    viewAll
                                    data={
                                        isSuccess && data.length > 0 ? data : []
                                    }
                                    loading={isLoading}
                                    onRowClick={(item) =>
                                        navigate({
                                            to: "/hr-view/$id",
                                            params: {
                                                id: item.id.toString(),
                                            },
                                        })
                                    }
                                    height={"h-[40vh]"}
                                    skeletonRowCount={5}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))}
            </div>
        </div>
    )
}

export default PositionAccordion
