import { USER_YEAR_TOTAL_MONTH_DAYS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useNavigate, useParams, useSearch } from "@tanstack/react-router"
import { useCallback } from "react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import DaysTableHeader from "./days-header"
import { getTimeDifference } from "../../office-detail/cols"
import OneDaysAccordion from "./one-day-statistic"
import { cn } from "@/lib/utils"
import EmptyBox from "@/components/custom/empty-box"
import AccordionSkeletion from "@/components/custom/accordion-skeletion"

export const statusData: { [key: number | string]: string } = {
    0: "Kutilmoqda",
    1: "Qabul qilingan",
    2: "Rad etilgan",
}

export default function DaysAccordion() {
    const navigate = useNavigate()
    const { id } = useParams({ from: "/_main/hr-view/$id" })
    const search: SearchParams = useSearch({ strict: false })
    const {
        data: info,
        isLoading,
        isSuccess,
    } = useGet<HumanYear[]>(`${USER_YEAR_TOTAL_MONTH_DAYS}/${id}`, {
        params: {
            year: (search as any)?.year,
            month: (search as any)?.month,
        },
        options: {
            enabled: Boolean((search as any)?.month),
        },
    })

    const clickAccordion = useCallback(
        (key: string) => {
            navigate({
                to: "/hr-view/$id",
                params: { id },

                search: (prev) => ({
                    ...prev,
                    day: search.date === key ? undefined : key,
                }),
            })
        },
        [navigate, id, search.date],
    )

    return (
        <div>
            <DaysTableHeader />
            {isLoading && <AccordionSkeletion columnCount={6} rowCount={2} />}

            {isSuccess && info?.length === 0 && (
                <div className="bg-accent/20 rounded-b-md">
                    <EmptyBox height="h-[30vh]" />
                </div>
            )}
            {isSuccess &&
                info?.map((item, index) => (
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        value={search?.day ?? undefined}
                        onValueChange={(val) => {
                            clickAccordion(val)
                        }}
                    >
                        <AccordionItem
                            value={String(item?.date?.slice(-2))}
                            className={cn(
                                index === info.length - 1 && "!border-none",
                            )}
                        >
                            <AccordionTrigger
                                className={cn(
                                    "px-3 dark:bg-accent/20 bg-stone-100 dark:data-[state=open]:bg-accent/20 data-[state=open]:bg-stone-100",
                                    index === info.length - 1 && "rounded-b-md",
                                    item?.date &&
                                        item?.date?.slice(-2) ==
                                            String(search?.day) &&
                                        "rounded-b-md",
                                )}
                            >
                                <div className="grid grid-cols-6 gap-10 text-start font-medium w-full">
                                    <p className="text-sm">
                                        {item?.date
                                            ? item?.date?.slice(-2)
                                            : "-"}
                                    </p>
                                    <p className="text-sm">
                                        {item?.work_shift_start?.slice(0, 5)} ~
                                        {item?.work_shift_end?.slice(0, 5)}
                                    </p>

                                    <p className="text-sm">
                                        {item?.attendance_time
                                            ? item?.attendance_time?.slice(0, 5)
                                            : "-"}
                                    </p>

                                    <p className="text-sm">
                                        {getTimeDifference(
                                            item.work_shift_start,
                                            item.attendance_time,
                                        )}
                                    </p>
                                    <p className="text-sm">
                                        {item?.left_time
                                            ? item?.left_time?.slice(0, 5)
                                            : "-"}
                                    </p>
                                    <p className="text-sm">
                                        {item.left_time
                                            ? getTimeDifference(
                                                  item.left_time,
                                                  item.work_shift_end,
                                              )
                                            : "-"}
                                    </p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="flex  flex-col pl-6">
                                <OneDaysAccordion />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))}
        </div>
    )
}
