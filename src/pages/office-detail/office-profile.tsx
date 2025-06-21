import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { OFFICE_DETAILS } from "@/constants/api-endpoints"
import useCheckPermission from "@/hooks/use-check-permission"
import { useGet } from "@/hooks/useGet"
import { formatMoney } from "@/lib/format-money"
import { Link, useParams, useSearch } from "@tanstack/react-router"
import {
    AlertCircle,
    ChevronRight,
    Clock,
    UserCheck,
    Users,
    UserX,
    XCircle,
} from "lucide-react"

export default function AttendanceDashboard() {
    const search = useSearch({ from: "__root__" })
    const { id } = useParams({ strict:false })
    const { data: dataDetails } = useGet<CompanyStats>(
        `${OFFICE_DETAILS}/${id}`,
        { params: { date: search.date }, options: { enabled: Boolean(id) } },
    )

    const total = dataDetails?.total ?? 0
    const usersInCompany =
        Number(dataDetails?.in_time) + Number(dataDetails?.late)
    const arrivedOnTime = dataDetails?.in_time ?? 0
    const lateUsers = dataDetails?.late ?? 0
    const absentUsers =
        Number(dataDetails?.excused) + Number(dataDetails?.absent)
    const absentWithReason = dataDetails?.excused ?? 0
    const absentWithoutReason = dataDetails?.absent ?? 0

    const getPercent = (value: number, total: number): string => {
        if (total === 0) return "0%"

        const percent = (value / total) * 100

        return percent % 1 === 0
            ? `${percent.toFixed(0)}%`
            : `${percent.toFixed(2)}%`
    }

    const { checkAllow } = useCheckPermission()

    return (
        <div className="mx-auto">
            <Card className="my-4 p-2">
                <CardHeader className="p-3 hover:pr-12 group transition-all duration-300 cursor-pointer">
                    <Link
                        className="flex items-center w-full relative"
                        search={{ id: String(id) }}
                        to={checkAllow("roles_view") ? "/all-employees" : "/"}
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold dark:text-primary-500">
                                Hodimlar soni
                            </h1>
                        </div>
                        <span className="text-3xl font-bold dark:text-primary-500 ">
                            {formatMoney(total)}
                        </span>
                        <span className="ml-4 absolute [transform:rotateY(90deg)] -right-6 group-hover:-right-12 group-hover:[transform:rotateY(0deg)] transition-all duration-300 text-primary">
                            <ChevronRight size={32} />
                        </span>
                    </Link>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Hodimlar ishxonada */}
                <div className="space-y-4">
                    <Card className="p-2">
                        <CardHeader className="pb-0 hover:pr-12 group transition-all duration-300 cursor-pointer">
                            <Link
                                className="flex items-center justify-between w-full relative"
                                search={{ id: String(id) }}
                                to={
                                    checkAllow("roles_view") ? "/arrivals" : "/"
                                }
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#10B981]/20 text-[#10B981] p-2 rounded-lg">
                                        <UserCheck className="h-5 w-5" />
                                    </div>
                                    <h1 className="text-2xl font-light text-[#10B981]">
                                        Kelganlar
                                    </h1>
                                </div>
                                <div className="flex items-center gap-2 text-[#10B981]">
                                    <span className="text-lg text-gray-400">
                                        ({getPercent(usersInCompany, total)})
                                    </span>
                                    <span className="text-2xl font-bold">
                                        {formatMoney(usersInCompany)}
                                    </span>
                                </div>

                                <span className="ml-4 absolute [transform:rotateY(90deg)] -right-6 group-hover:-right-12 group-hover:[transform:rotateY(0deg)] transition-all duration-300 text-[#10B981]">
                                    <ChevronRight size={24} />
                                </span>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <Progress
                                className="h-2 bg-[#10B981] "
                                value={(usersInCompany / total) * 100}
                            />

                            <div className="mt-6 space-y-4">
                                <Link
                                    className="flex items-center relative justify-between hover:pr-12 group transition-all duration-300 cursor-pointer"
                                    search={{ id: String(id), status: "1" }}
                                    to={
                                        checkAllow("roles_view")
                                            ? "/arrivals"
                                            : "/"
                                    }
                                >
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-[#6dceaef5]" />
                                        <span className="text-sm text-[#6dceaef5]">
                                            Vaqtida kelganlar
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">
                                            ({getPercent(arrivedOnTime, total)})
                                        </span>
                                        <span className="text-base font-semibold text-[#6dceaef5]">
                                            {formatMoney(arrivedOnTime)}
                                        </span>
                                    </div>

                                    <span className="ml-4 absolute [transform:rotateY(90deg)] -right-6 group-hover:right-0 group-hover:[transform:rotateY(0deg)] transition-all duration-300 text-[#6dceaef5]">
                                        <ChevronRight size={24} />
                                    </span>
                                </Link>
                                <Progress
                                    className="h-1.5 bg-[#34D399]"
                                    value={(arrivedOnTime / total) * 100}
                                />

                                <Link
                                    className="flex items-center justify-between relative hover:pr-12 group transition-all duration-300"
                                    search={{ id: String(id), status: "0" }}
                                    to={
                                        checkAllow("roles_view")
                                            ? "/arrivals"
                                            : "/"
                                    }
                                >
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <Clock className="h-4 w-4 text-[#FDBA74]" />
                                        <span className="text-sm text-[#FDBA74]">
                                            Kech qolganlar
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">
                                            ({getPercent(lateUsers, total)})
                                        </span>
                                        <span className="text-base font-semibold text-[#FDBA74]">
                                            {formatMoney(lateUsers)}
                                        </span>
                                    </div>

                                    <span className="ml-4 absolute [transform:rotateY(90deg)] -right-6 group-hover:right-0 group-hover:[transform:rotateY(0deg)] transition-all duration-300 text-[#FDBA74]">
                                        <ChevronRight size={24} />
                                    </span>
                                </Link>
                                <Progress
                                    className="h-1.5 bg-[#FDBA74]"
                                    value={(lateUsers / total) * 100}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Kelmagan hodimlar */}
                <div className="space-y-4">
                    <Card className="p-2">
                        <CardHeader className="pb-0 relative hover:pr-12 group transition-all duration-300">
                            <Link
                                className="flex items-center justify-between w-full"
                                search={{ id: String(id) }}
                                to={checkAllow("roles_view") ? "/absent" : "/"}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#DC2626]/10 text-[#DC2626] p-2 rounded-lg">
                                        <UserX className="h-5 w-5" />
                                    </div>
                                    <h1 className="text-2xl font-light text-[#DC2626]">
                                        Kelmaganlar
                                    </h1>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg text-gray-400">
                                        ({getPercent(absentUsers, total)})
                                    </span>
                                    <span className="text-2xl font-bold text-[#DC2626]">
                                        {formatMoney(absentUsers)}
                                    </span>
                                </div>

                                <span className="ml-4 absolute [transform:rotateY(90deg)] -right-6 group-hover:right-0 group-hover:[transform:rotateY(0deg)] transition-all duration-300 text-[#DC2626]">
                                    <ChevronRight size={24} />
                                </span>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <Progress
                                className="h-2 bg-[#DC2626]/60"
                                value={(absentUsers / total) * 100}
                            />

                            <div className="mt-6 space-y-4">
                                <Link
                                    className="flex items-center justify-between relative hover:pr-12 group transition-all duration-300"
                                    search={{ id: String(id), status: "1" }}
                                    to={
                                        checkAllow("roles_view")
                                            ? "/absent"
                                            : "/"
                                    }
                                >
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-[#FBBF24]" />
                                        <span className="text-sm text-[#FBBF24]">
                                            Sababli
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">
                                            (
                                            {getPercent(
                                                absentWithReason,
                                                total,
                                            )}
                                            )
                                        </span>
                                        <span className="text-base font-semibold text-[#FBBF24]">
                                            {formatMoney(absentWithReason)}
                                        </span>
                                    </div>
                                    <span className="ml-4 absolute [transform:rotateY(90deg)] -right-6 group-hover:right-0 group-hover:[transform:rotateY(0deg)] transition-all duration-300 text-[#FBBF24]">
                                        <ChevronRight size={24} />
                                    </span>
                                </Link>

                                <Progress
                                    className="h-1.5 bg-[#FBBF24]"
                                    value={(absentWithReason / total) * 100}
                                />

                                <Link
                                    className="flex items-center justify-between relative hover:pr-12 group transition-all duration-300"
                                    search={{ id: String(id), status: "0" }}
                                    to={
                                        checkAllow("roles_view")
                                            ? "/absent"
                                            : "/"
                                    }
                                >
                                    <div className="flex items-center gap-2">
                                        <XCircle className="h-4 w-4 text-[#e75a5a]" />
                                        <span className="text-sm text-[#e75a5a]">
                                            Sababsiz
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">
                                            (
                                            {getPercent(
                                                absentWithoutReason,
                                                total,
                                            )}
                                            )
                                        </span>
                                        <span className="text-base font-semibold text-[#e75a5a]">
                                            {formatMoney(absentWithoutReason)}
                                        </span>
                                    </div>
                                    <span className="ml-4 absolute [transform:rotateY(90deg)] -right-6 group-hover:right-0 group-hover:[transform:rotateY(0deg)] transition-all duration-300 text-[#e75a5a]">
                                        <ChevronRight size={24} />
                                    </span>
                                </Link>
                                <Progress
                                    className="h-1.5 bg-[#e75a5a]"
                                    value={(absentWithoutReason / total) * 100}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
