import { USER_STATISTIC } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useParams, useSearch } from "@tanstack/react-router"
import PositionHrCard from "./position-card"
import EmptyBox from "@/components/custom/empty-box"


function PositionHrView() {
    const { id } = useParams({ from: "/_main/position-hr-view/$id" })
    const search = useSearch({ from: "/_main/position-hr-view/$id" })

    const { data, isSuccess, isLoading } = useGet<WorkerAttendance[]>(
        `${USER_STATISTIC}/${(search as { position: string })?.position}/${id}`,
        {
            options: {
                enabled:
                    Boolean(id) &&
                    Boolean((search as { position: string })?.position),
            },
        },
    )

    return (
        <div>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                {isSuccess &&
                    data?.map((item) => (
                        <PositionHrCard data={item} key={item.id} />
                    ))}
                {isLoading &&
                    Array.from({ length: 12 })?.map((_, index) => (
                        <PositionHrCard key={index} />
                    ))}
            </div>
            {isSuccess && data.length === 0 && (
                <div className="rounded-md bg-card">
                    <EmptyBox />
                </div>
            )}
        </div>
    )
}

export default PositionHrView
