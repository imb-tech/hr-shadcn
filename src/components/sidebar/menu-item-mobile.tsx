import { Link, useLocation } from "@tanstack/react-router"
import { ReactNode } from "react"
import { Button } from "../ui/button"

type Props = {
    to: string
    title: string
    icon: ReactNode
    enabled?: boolean
    badge?: number
}

export default function MenuItemMobile({ to, title, icon, badge }: Props) {
    const { pathname } = useLocation()

    return (
        <Button color="default" variant="ghost" className="relative z-50">
            <Link
                activeProps={{ className: "!opacity-100" }}
                className={`w-full h-full flex flex-col items-center justify-start opacity-50 ${pathname.startsWith("/office/") && to === "/" ? "!opacity-100" : ""}`}
                to={to}
                // activeOptions={{}}
            >
                <span>{icon}</span>
                {/* <span className="">{title}</span> */}
            </Link>

            {badge ?
                <span className="absolute text-xs right-2 top-0 size-6 z-50 sm:flex items-center justify-center bg-gray-500/70 rounded-full text-white hidden">
                    {badge}
                </span>
            :   ""}
        </Button>
    )
}
