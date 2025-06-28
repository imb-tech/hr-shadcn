import { USER_YEAR_TOTAL_MONTH_DAYS_ONE } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useParams, useSearch } from "@tanstack/react-router"
import { statusData } from "./days-accordion"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
export default function OneDaysAccordion() {
    const { id } = useParams({ from: "/_main/hr-view/$id" })
    const search = useSearch({ strict: false })
    const {
        data: info,
        isSuccess,
        isLoading,
    } = useGet<
        { first_time: string; second_time: string; status: string | number }[]
    >(`${USER_YEAR_TOTAL_MONTH_DAYS_ONE}/${id}`, {
        params: { date: search?.day },
        options: {
            enabled: !search?.date,
        },
    })

    return (
        <div>
            <div className="grid grid-cols-2 gap-3 dark:bg-neutral-900 bg-neutral-200 mt-3 p-3 text-foreground-500 rounded-t-lg">
                <p className="text-sm">Kelish va Ketish vaqti</p>
                <p className="text-sm">Qayerda</p>
            </div>
            <div className="px-3 dark:bg-neutral-900/50 bg-zinc-200/50 rounded-b-lg ">
                {isLoading ? (
                    <div className="grid grid-cols-2 gap-5 py-3  ">
                        <Skeleton className="h-8 rounded-md" />
                        <Skeleton className="h-8 rounded-md" />
                    </div>
                ) : isSuccess && info.length === 0 ? (
                    <div className="p-3 text-sm text-zinc-500 text-center">
                        Ma'lumot topilmadi
                    </div>
                ) : (
                    info?.map((item, index) => (
                        <div
                            key={index}
                            className={cn(
                                "grid grid-cols-2 gap-5 py-3 border-b dark:border-b-zinc-700",
                                index === info.length - 1 && "!border-none",
                            )}
                        >
                            <p className="text-sm">
                                {item.first_time} - {item.second_time}
                            </p>
                            <div className="text-sm flex items-center gap-3">
                                <p>{statusData[item.status]}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
