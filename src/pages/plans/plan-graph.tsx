import { GET_ME } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { CircleCheckBig, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { months } from "./utils"

export default function PlanGraph() {
    const curr = new Date().getMonth() + 1
    const { data } = useGet<Profile>(GET_ME)

    return (
        <div className="gap-3">
            <Card className="p-2 rounded-md">
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
                    {months.map((month) => {
                        const color = getMonthColor(
                            Number(month.key),
                            data?.balance ?? 0,
                            data?.employees_count ?? 0,
                            curr,
                        )

                        const colorClasses = {
                            green: "bg-green-500/15 text-green-500",
                            yellow: "bg-yellow-500/15 text-yellow-500",
                            gray: "bg-gray-500/15 text-gray-500",
                            orange: "bg-orange-500/15 text-orange-500",
                        }

                        return (
                            <div
                                key={month.key}
                                className={cn(
                                    "p-2 rounded-md flex flex-col gap-2 items-center",
                                    colorClasses[color],
                                )}
                            >
                                <p className="text-sm ">{month.name}</p>
                                <span className="opacity-80">
                                    {Number(month.key) > curr ?
                                        <Clock size={20} />
                                    :   <CircleCheckBig size={20} />}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </Card>
        </div>
    )
}

function getMonthlyPrice(employeesCount: number): number {
    if (employeesCount <= 20) {
        return 300_000
    } else if (employeesCount <= 50) {
        return 400_000
    } else if (employeesCount <= 100) {
        return 600_000
    } else {
        // 100 ta uchun 600_000 + ortiqcha har biriga 7_000
        const extraEmployees = employeesCount - 100
        return 600_000 + extraEmployees * 7_000
    }
}

function getMonthColor(
    monthKey: number,
    balance: number,
    employeesCount: number,
    currMonth: number,
): "green" | "yellow" | "gray" | "orange" {
    const monthlyPrice = getMonthlyPrice(employeesCount)

    if (monthKey < currMonth) {
        // Avvalgi oylar doim kulrang (to'langan)
        return "gray"
    }

    if (monthKey === currMonth) {
        // Hozirgi oy ham yashil bo'ladi (to'langan deb hisoblaymiz)
        return "green"
    }

    // Keyingi oylar uchun balansdan hozirgi oy uchun hech narsa yechmaymiz
    // Shunday qilib, balans to'liq keyingi oylar uchun ishlatiladi

    const monthsAhead = monthKey - currMonth // hozirgi oydan keyingi oylar soni

    // Keyingi oylar uchun talab qilinadigan summa:
    const requiredForNextMonths = monthsAhead * monthlyPrice

    if (balance >= requiredForNextMonths) {
        return "green" // balans yetarli
    } else {
        return "yellow" // balans kam
    }
}
