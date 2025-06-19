import { linkOptions } from "@tanstack/react-router"
import {
    CalendarRange,
    ChartNoAxesCombined,
    ClipboardList,
    GraduationCap,
    House,
    Layers,
    NotebookText,
    Settings,
    Users2,
} from "lucide-react"
import { ReactNode } from "react"

export interface MenuItem {
    label: string
    icon?: ReactNode
    path: string
}

export const menuItems = [
    linkOptions({
        title: "Bosh sahifa",
        icon: <House width={20} />,
        to: "/",
        enabled: true,
        items: [],
    }),
    linkOptions({
        title: "Lidlar",
        icon: <ClipboardList width={20} />,
        to: "/lids",
        enabled: true,
        items: [],
    }),
    linkOptions({
        title: "Guruhlar",
        icon: <Layers width={20} />,
        to: "/groups",
        enabled: true,
        items: [],
    }),
    linkOptions({
        title: "Hodimlar",
        icon: <Users2 width={20} />,
        to: "/employees",
        enabled: true,
        items: [],
    }),
    linkOptions({
        title: "O'quvchilar",
        icon: <GraduationCap width={20} />,
        to: "/students",
        enabled: true,
        items: [],
    }),
    linkOptions({
        title: "Davomatlar",
        icon: <CalendarRange width={20} />,
        to: "/attendance",
        enabled: true,
        items: [
            linkOptions({
                title: "Guruhlar davomati",
                to: "/attendance/students",
                enabled: true,
                items: [],
            }),
            linkOptions({
                title: "Xodimlar davomati",
                to: "/attendance/employees",
                enabled: true,
                items: [],
            }),
        ],
    }),
    linkOptions({
        title: "Moliya",
        icon: <ChartNoAxesCombined width={20} />,
        to: "/finance",
        enabled: true,
        items: [],
    }),
    linkOptions({
        title: "Hisobotlar",
        icon: <NotebookText width={20} />,
        to: "/reports",
        enabled: true,
        items: [],
    }),
    linkOptions({
        title: "Sozlamalar",
        icon: <Settings width={20} />,
        to: "/settings",
        enabled: true,
        items: [
            linkOptions({
                title: "Filiallar",
                to: "/settings/branches",
                enabled: true,
                items: [],
            }),
            linkOptions({
                title: "Xonalar",
                to: "/settings/rooms",
                enabled: true,
                items: [],
            }),
            linkOptions({
                title: "Kurslar",
                to: "/settings/courses",
                enabled: true,
                items: [],
            }),
            linkOptions({
                title: "To'lov turlari",
                to: "/settings/payment-type",
                enabled: true,
                items: [],
            }),
            linkOptions({
                title: "Dam olish kunlari",
                to: "/settings/holidays",
                enabled: true,
                items: [],
            }),
            linkOptions({
                title: "Rollar",
                to: "/settings/roles",
                enabled: true,
                items: [],
            }),
        ],
    }),
]
