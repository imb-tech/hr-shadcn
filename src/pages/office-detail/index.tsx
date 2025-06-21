import { ROLES_STATISTIC } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useParams, useSearch } from "@tanstack/react-router"
import OfficeList from "./office-list"
import OfficeProfile from "./office-profile"
import PositionAccordion from "./position-accordion"
import PositonCard from "./positon-card"
import ParamTabs from "@/components/as-params/tabs"
import { tabsParam } from "../absent"
import EmptyBox from "@/components/custom/empty-box"

export default function OfficeDetail() {
    const search = useSearch({ from: "__root__" })

    const { id } = useParams({ strict: false })
    const {
        data: info,
        isSuccess,
        isLoading,
    } = useGet<CompanyStats[]>(`${ROLES_STATISTIC}/${id}`, {
        params: {
            date: search?.date,
        },
        options: {
            enabled: Boolean(id),
        },
    })

    const positionCard = () =>
        info?.map((item, index) => <PositonCard key={index} item={item} />)
    const positionCardSkeletion = () =>
        Array.from({ length: 8 })?.map((_, index) => (
            <PositonCard key={index} />
        ))

    return (
        <div className=" w-full">
            <OfficeList />
            <OfficeProfile />
            <div className="flex justify-between items-center gap-3 mt-4">
                <h2 className="text-xl">Lavozimlar bo'yicha yo'qlama</h2>
                <div className="hidden lg:block">
                    <ParamTabs paramName="tabs" options={tabsParam} />
                </div>
            </div>

            {search.tabs === "card" ? (
                <div className="sm:grid hidden lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-4 my-4 max-w-full">
                    {isSuccess && !!info && positionCard()}
                    {isLoading && positionCardSkeletion()}
                </div>
            ) : (
                <div>
                    <PositionAccordion info={info} loading={isLoading} />
                    <div className="lg:hidden flex gap-4 my-4 max-w-full overflow-x-auto no-scrollbar-x">
                        {isSuccess && !!info && positionCard()}
                        {isLoading && positionCardSkeletion()}
                    </div>
                </div>
            )}

            {isSuccess && info?.length === 0 && (
                <div className="rounded-md bg-card mt-3">
                    <EmptyBox />
                </div>
            )}
        </div>
    )
}
