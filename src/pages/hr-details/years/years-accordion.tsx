import { USER_YEAR_TOTAL } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useNavigate, useParams, useSearch } from "@tanstack/react-router"
import MonthAccordion from "../months/month-accordion"
import YearsTableHeader from "./years-header"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useCallback } from "react"
import { cn } from "@/lib/utils"
import AccordionSkeletion from "@/components/custom/accordion-skeletion"
import EmptyBox from "@/components/custom/empty-box"

export default function YearsAccordion() {
    const navigate = useNavigate()
    const { id } = useParams({ from: "/_main/hr-view/$id" })
    const search: SearchParams = useSearch({ from: "/_main/hr-view/$id" })
    const {
        data: info,
        isLoading,
        isSuccess,
    } = useGet<HumanYear[]>(`${USER_YEAR_TOTAL}/${id}`)

    const clickAccordion = useCallback(
        (key: string) => {
            navigate({
                to: "/hr-view/$id",
                params: { id },
                search: {
                    year: search.year === key ? undefined : key,
                },
            })
        },
        [navigate, id, search.year],
    )

    return (
        <>
            <YearsTableHeader />
            {isLoading && <AccordionSkeletion columnCount={4} rowCount={2} />}

            {isSuccess && info?.length === 0 && (
                <div className="bg-card rounded-b-md">
                    <EmptyBox height="h-[30vh]" />
                </div>
            )}
            {isSuccess &&
                info?.map((item, index) => (
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        value={search?.year ?? undefined}
                        onValueChange={(val) => {
                            clickAccordion(val)
                        }}
                    >
                        <AccordionItem
                            value={item?.year?.toString()}
                            className={cn(
                                index === info.length - 1 && "!border-none",
                            )}
                        >
                            <AccordionTrigger
                                className={cn(
                                    "px-3 bg-card data-[state=open]:bg-card",
                                    index === info.length - 1 && "rounded-b-md",
                                    item.year &&
                                        item.year == Number(search.year) &&
                                        "rounded-b-md",
                                )}
                            >
                                <div className="grid grid-cols-4 gap-10 text-start font-medium w-full">
                                    <p className="text-sm">{item.year}</p>
                                    <p className="text-sm">
                                        {item.late_count} marta
                                    </p>
                                    <p className="text-sm">
                                        {item.late_duraction || 0} soat
                                    </p>
                                    <p className="text-sm">{item.fine} so'm</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="flex pl-6 flex-col ">
                                <MonthAccordion />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))}
        </>
    )
}
