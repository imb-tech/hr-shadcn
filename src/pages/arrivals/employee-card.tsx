import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatMoney } from "@/lib/format-money"
import { formatPhoneNumber } from "@/lib/format-phone-number"
import formatPassportNumber from "@/lib/formatter-pasport"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import { format } from "date-fns"
import { Clock, MapPin, Phone, User } from "lucide-react"

const EmployeeCard = ({
    item,
    status,
    color,
}: {
    item?: Human | undefined
    status?: string
    color?: string
}) => {
    return (
        <Link params={{ id: item?.id?.toString() || "/" }} to="/hr-view/$id">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    {/* <Avatar
            className="h-14 w-14"
            src="https://images.unsplash.com/broken"
          /> */}
                    <div>
                        <h3 className="font-semibold">{item?.full_name || "Hodim ism familiyasi"}</h3>
                        <p className="text-sm text-muted-foreground">
                            {item?.role_name || "Lavozim"}
                        </p>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <div
                            className={cn(
                                "text-sm rounded-full px-3 py-[2px]  dark:bg-zinc-800 border dark:border-zinc-700",
                                color,
                            )}
                        >
                            {status || "status"}
                        </div>
                        <div className="text-sm rounded-full px-3 py-[2px] dark:bg-zinc-800 border dark:border-zinc-700">
                            {formatMoney(item?.salary)} so'm
                        </div>
                    </div>

                    <div className="space-y-4  h-full">
                        <div className="flex items-center gap-3">
                            <div className="dark:bg-zinc-800 bg-zinc-100 p-2 rounded-full">
                                <Phone className="h-4 w-4 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Tel</p>
                                <p>{item?.phone ?formatPhoneNumber(String(item?.phone)) : "+998 90 000 00 00"}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="dark:bg-zinc-800 bg-zinc-100 p-2 rounded-full mt-1">
                                <MapPin className="h-4 w-4 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">
                                    Yashash manzil
                                </p>
                                <p className="text-sm">{item?.address || "Toshkent shahar, Chilonzor tumani"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="dark:bg-zinc-800 bg-zinc-100 p-2 rounded-full">
                                <User className="h-4 w-4 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Pasport</p>
                                <p>
                                    {item?.id_number
                                        ? formatPassportNumber(item?.id_number)
                                        : "AB 000 00 00"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="dark:bg-zinc-800 bg-zinc-100 p-2 rounded-full">
                                <Clock className="h-4 w-4 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">
                                    Ish vaqti
                                </p>
                                <p>
                                    <span className="whitespace-nowrap lg:break-all">
                                        {item?.work_shift_start?.slice(0, 5)} -{" "}
                                        {item?.work_shift_end?.slice(0, 5)}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {
                        <div className="mt-6 dark:bg-zinc-800 bg-zinc-100 rounded-lg p-4 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">
                                    Kelish
                                </p>
                                <p className="font-medium text-green-400">
                                    {item?.attendance_json?.attendance_time
                                        ? format(
                                              item?.attendance_json
                                                  ?.attendance_time,
                                              "HH:mm",
                                          )
                                        : "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">
                                    Ketish
                                </p>
                                <p className="font-medium text-red-400">
                                    {item?.attendance_json?.left_time
                                        ? format(
                                              item?.attendance_json?.left_time,
                                              "HH:mm",
                                          )
                                        : "-"}
                                </p>
                            </div>
                        </div>
                    }
                </CardContent>
            </Card>
        </Link>
    )
}

export default EmployeeCard
