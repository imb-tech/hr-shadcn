import { HR_API } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { formatMoney } from "@/lib/format-money"
import { formatPhoneNumber } from "@/lib/format-phone-number"
import formatPassportNumber from "@/lib/formatter-pasport"
import { cn, educationLevels } from "@/lib/utils"
import { useParams } from "@tanstack/react-router"
import { ColumnDef } from "@tanstack/react-table"
import {
    FileUser,
    GraduationCap,
    MapPinCheck,
    MapPinHouse,
    Phone,
    PhoneCall,
} from "lucide-react"
import { useMemo } from "react"
import YearsAccordion from "./years/years-accordion"

export const useHrListCols = () => {
    return useMemo<ColumnDef<any>[]>(
        () => [
            { header: "Sana", accessorKey: "date_start" },
            { header: "Holat", accessorKey: "status" },
            { header: "Vaqt", accessorKey: "date" },
        ],
        [],
    )
}

function ViewPage() {
    const { id } = useParams({ strict: false })
    const { data } = useGet<Human>(`${HR_API}/${id}`, {
        options: { enabled: Boolean(id) },
    })

    return (
        <div className="py-4">
            <div className="border-divider border rounded-lg  p-4 flex lg:flex-row flex-col gap-5 lg:gap-0 lg:justify-between lg:items-start">
                <div className="flex flex-col sm:flex-row items-start gap-6 h-full">
                    <div className="border border-divider  h-[200px] sm:h-full sm:w-[215px] rounded-lg">
                        <img
                            alt="blah blah"
                            className="w-full h-full object-cover rounded-lg max-h-[200px] object-center"
                            src={
                                typeof data?.face == "string" ?
                                    data.face
                                :   "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                            }
                        />
                    </div>
                    <ul className="h-full flex flex-col items-stretch gap-[3px]">
                        <li className="font-bold text-2xl">
                            {data?.first_name} {data?.last_name}{" "}
                            {data?.middle_name || ''}
                        </li>
                        <li className="flex flex-col sm:flex-row gap-2 sm:items-center">
                            <div className="flex gap-2 items-center min-w-52 text-foreground-500">
                                <PhoneCall size={16} /> <span>Tel:</span>
                            </div>
                            <span>
                                {data?.profile?.phone_number ?
                                    formatPhoneNumber(
                                        String(data?.profile?.phone_number),
                                    )
                                :   "-"}
                            </span>
                        </li>
                        <li className="flex flex-col sm:flex-row gap-2 sm:items-center">
                            <div className="flex gap-2 items-center min-w-52 text-foreground-500">
                                <Phone size={16} /> <span>Qo'shimcha tel:</span>
                            </div>
                            <span>
                                {data?.profile?.phone_number2 ?
                                    formatPhoneNumber(
                                        data?.profile?.phone_number2,
                                    )
                                :   "-"}
                            </span>
                        </li>
                        <li className="flex flex-col sm:flex-row gap-2 sm:items-center">
                            <div className="flex gap-2 items-center min-w-52 text-foreground-500">
                                <MapPinHouse size={16} />{" "}
                                <span>Doimiy manzil:</span>
                            </div>
                            <span>
                                {data?.profile?.address ?
                                    data?.profile?.address
                                :   "-"}
                            </span>
                        </li>
                        <li className="flex flex-col sm:flex-row gap-2 sm:items-center">
                            <div className="flex gap-2 items-center min-w-52 text-foreground-500">
                                <MapPinCheck size={16} />{" "}
                                <span>Vaqtinchalik manzil:</span>
                            </div>
                            <span>
                                {data?.profile?.residence ?
                                    data?.profile?.residence
                                :   "-"}
                            </span>
                        </li>
                        <li className="flex flex-col sm:flex-row gap-2 sm:items-center">
                            <div className="flex gap-2 items-center min-w-52 text-foreground-500">
                                <FileUser size={16} /> <span>Pasport:</span>
                            </div>
                            <span>
                                {data?.profile?.id_number ?
                                    formatPassportNumber(
                                        data?.profile?.id_number,
                                    )
                                :   "-"}
                            </span>
                        </li>
                        <li className="flex flex-col sm:flex-row gap-2 sm:items-center">
                            <div className="flex gap-2 items-center min-w-52 text-foreground-500">
                                <GraduationCap size={16} />{" "}
                                <span>Ma'lumoti:</span>
                            </div>
                            <span>
                                {data?.profile?.education ?
                                    educationLevels?.find(
                                        (item) =>
                                            item.key ==
                                            Number(data?.profile?.education),
                                    )?.label
                                :   "-"}
                            </span>
                        </li>
                    </ul>
                </div>

                <div className=" flex-col border border-divider py-3 whitespace-nowrap px-6 rounded-lg flex items-start justify-center gap-1">
                    <div className="flex items-center">
                        <span className=" min-w-24 font-medium ">Maosh:</span>
                        <span className="font-medium">
                            {formatMoney(data?.salary) || 0} so'm
                        </span>
                    </div>
                    <div className="flex items-center w-full border-b pb-2 dark:border-b-zinc-700">
                        <span className=" min-w-24 font-medium ">Jarima:</span>
                        <span
                            className={cn(
                                " font-medium",
                                data?.fine !== 0 && "text-red-500",
                            )}
                        >
                            {formatMoney(data?.fine) || 0} so'm
                        </span>
                    </div>
                    <div className="flex items-center ">
                        <strong className="min-w-24 text-xl">Balans:</strong>
                        <span className="text-xl">
                            {formatMoney(
                                Number(data?.salary) - Number(data?.fine),
                            ) || 0}{" "}
                            so'm
                        </span>
                    </div>
                </div>
            </div>
            <div className="mt-8 overflow-x-auto ">
                <div className="min-w-[1024px]">
                    <YearsAccordion />

                </div>
            </div>
        </div>
    )
}

export default ViewPage
