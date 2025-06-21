import { USER_YEAR_TOTAL_MONTH } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useNavigate, useParams, useSearch } from "@tanstack/react-router"
import { useCallback } from "react"
import DaysAccordion from "../days/days-accordion"
import AccordionSkeletion from "@/components/custom/accordion-skeletion"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import MonthTableHeader from "./month-header"
import { cn } from "@/lib/utils"
import EmptyBox from "@/components/custom/empty-box"

export default function MonthAccordion() {
    const navigate = useNavigate()
    const { id } = useParams({ from: "/_main/hr-view/$id" })
    const search = useSearch({ strict: false })
    const {
        data: info,
        isLoading,
        isSuccess,
    } = useGet<HumanYear[]>(`${USER_YEAR_TOTAL_MONTH}/${id}`, {
        params: { year: (search as any)?.year },
        options: {
            enabled: Boolean((search as any)?.year),
        },
    })

    const clickAccordion = useCallback(
        (key: string) => {
            navigate({
                to: "/hr-view/$id",
                params: { id },

                search: (prev) => ({
                    ...prev,
                    month: search.month === key ? undefined : key,
                }),
            })
        },
        [navigate, id, search.month],
    )

    return (
        <>
            <MonthTableHeader />
            {isLoading && <AccordionSkeletion columnCount={4} rowCount={2} />}

            {isSuccess && info?.length === 0 && (
                <div className="dark:bg-secondary/40 bg-gray-200/80  rounded-b-md">
                    <EmptyBox height="h-[30vh]" />
                </div>
            )}
            {isSuccess &&
                info?.map((item, index) => (
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        value={search?.month ?? undefined}
                        onValueChange={(val) => {
                            clickAccordion(val)
                        }}
                    >
                        <AccordionItem
                            value={item?.month?.toString()}
                            className={cn(
                                index === info.length - 1 && "!border-none",
                            )}
                        >
                            <AccordionTrigger
                                className={cn(
                                    "px-3 dark:bg-secondary/40 bg-gray-200/80 dark:data-[state=open]:bg-secondary/40 data-[state=open]:bg-gray-200/80",
                                    index === info.length - 1 && "rounded-b-md",
                                    item?.month &&
                                        item?.month == String(search?.month) &&
                                        "rounded-b-md",
                                )}
                            >
                                <div className="grid grid-cols-4 gap-10 text-start font-medium w-full">
                                    <p className="text-sm">
                                        {monthKeys[item.month as any]}
                                    </p>
                                    <p className="text-sm">
                                        {item.late_count} marta
                                    </p>
                                    <p className="text-sm">
                                        {item.late_duration?.slice(0, 5)}
                                    </p>
                                    <p className="text-sm">{item.fine} so'm</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="flex  flex-col pl-6">
                                <DaysAccordion />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))}
        </>
    )
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
}
