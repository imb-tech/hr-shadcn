import { Card, CardContent } from "@/components/ui/card"
import { Building } from "lucide-react"
import { useState } from "react"
import OfficeChart from "./office-chart"

const OfficeTooltip = ({ office: { properties } }: { office: Office }) => {
    const [hover, setHover] = useState(false)

    return (
        <div className="flex justify-start cursor-pointer">
            <div
                className="relative flex justify-center items-center"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                {/* Hint radius (animatsiya uchun) */}
                <span
                    className={`rounded-full bg-white bg-opacity-10 transition-transform duration-500 ${
                        hover ?
                            "opacity-100 scale-100 visible"
                        :   "opacity-0 scale-0 invisible"
                    }`}
                    aria-hidden="true"
                />

                {/* Hint dot */}
                <span className="relative bg-background overflow-hidden rounded-full w-[36px] h-[36px] flex items-center justify-center text-white">
                    <span className="bg-gray-500/10 h-full w-full flex items-center justify-center">
                        <Building size={18} />
                    </span>
                    <span className="absolute bg-gray-500/10 h-10 top-0 w-10 flex items-center justify-center"></span>
                </span>

                {/* Hint content */}
                <div
                    className={`absolute bottom-[62px] left-1/2 ml-[64px] w-[300px] px-0 py-[35px] text-white pointer-events-none transition-opacity duration-700 ${
                        hover ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                >
                    <Card className="relative !z-50">
                        <CardContent className="p-4">
                            <div className="flex flex-row items-end gap-1">
                                <Building size={22} />
                                <span className="block text-[16px] m-0">
                                    {properties.name}
                                </span>
                            </div>
                            <div className="flex gap-3 p-2 justify-between items-center">
                                <div className="flex flex-col mt-2">
                                    <p className="w-full flex items-center justify-between font-extralight text-lg gap-3">
                                        Hodimlar:{" "}
                                        <span> {properties.total_count}</span>
                                    </p>
                                    <p className="w-full flex items-center justify-between font-extralight text-lg gap-3 text-green-400">
                                        Keldi:{" "}
                                        <span> {properties.exists_count}</span>
                                    </p>
                                    <p className="w-full flex items-center justify-between font-extralight text-lg gap-3 text-rose-400">
                                        Kelmadi:{" "}
                                        <span> {properties.absend_count}</span>
                                    </p>
                                </div>

                                {hover && <OfficeChart
                                    persentage={properties.persentage}
                                />}
                            </div>
                        </CardContent>
                    </Card>

                    {/* underline line */}
                    <div
                        className={`absolute bottom-[29px] left-0 h-[1px] bg-background dark:bg-white transition-all duration-400 ${
                            hover ? "w-[180px]" : "w-0"
                        }`}
                    />
                    {/* rotated line */}
                    <div
                        className="absolute bottom-[29px] left-0 h-[1px] bg-background dark:bg-white opacity-100 rotate-[-225deg] origin-[0_50%] w-[80px] transition-opacity duration-500"
                        style={{ transitionDelay: "0s" }}
                        aria-hidden="true"
                    />
                </div>
            </div>
        </div>
    )
}

export default OfficeTooltip
