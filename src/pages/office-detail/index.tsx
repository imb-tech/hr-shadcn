import { ROLES_STATISTIC } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useParams, useSearch } from "@tanstack/react-router"
import OfficeList from "./office-list"
import OfficeProfile from "./office-profile"
import PositionAccordion from "./position-accordion"
import PositonCard from "./positon-card"
import ParamTabs from "@/components/as-params/tabs"
import { tabsParam } from "../absent"

export default function OfficeDetail() {
    const search = useSearch({ from: "__root__" })

    const { id } = useParams({ from: "/_main/office/$id" })
    const { data: info, isSuccess } = useGet<CompanyStats[]>(
        `${ROLES_STATISTIC}/${id}`,
        {
            params: {
                date: search?.date,
            },
            options: {
                enabled: Boolean(id),
            },
        },
    )

    const positionCard = () => (
        <div className="flex gap-3">
            {info?.map((item, index) => (
                <div key={index} className="min-w-[350px]">
                    <PositonCard item={item} />
                </div>
            ))}
        </div>
    )

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
                isSuccess && !!info ? (
                    <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-4 my-4 max-w-full">
                        {info?.map((item, index) => (
                            <div key={index}>
                                <PositonCard item={item} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center h-48 w-full justify-center bg-gray-500/20 rounded-md my-2">
                        <p className="text-gray-500/95">
                            Lavozimlar ma'lumoti topilmadi
                        </p>
                    </div>
                )
            ) : (
                <div>
                    <PositionAccordion info={info} />
                    {isSuccess && !!info ? (
                        <div className="lg:hidden grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-4 my-4 max-w-full overflow-x-auto">
                            {positionCard()}
                        </div>
                    ) : (
                        <div className="lg:hidden flex items-center h-48 w-full justify-center bg-gray-500/20 rounded-md my-2">
                            <p className="text-gray-500/95">
                                Lavozimlar ma'lumoti topilmadi
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
