import useCheckPermission from "@/hooks/use-check-permission"
import { linkOptions } from "@tanstack/react-router"
import {
    Building2,
    ListTodo,
    MapPinned,
    NotebookText,
    ScrollText,
    SquareUser,
    UsersIcon,
    WalletMinimal,
} from "lucide-react"
import { useMemo } from "react"

export default function usePath() {
    const { checkAllow } = useCheckPermission()

    const links = useMemo(
        () => [
            linkOptions({
                to: "/office",
                icon: <Building2 />,
                enabled: checkAllow("office_view"),
                title: "Ofis",
            }),
            linkOptions({
                to: "/map",
                icon: <MapPinned />,
                enabled: checkAllow("map_view"),
                title: "Xarita",
            }),
            linkOptions({
                to: "/roles",
                icon: <SquareUser />,
                enabled: checkAllow("roles_view"),
                title: "Lavozimlar",
            }),
            linkOptions({
                to: "/hr",
                icon: <UsersIcon />,
                enabled: checkAllow("employee_view"),
                title: "Hodimlar",
            }),
            linkOptions({
                to: "/project",
                icon: <ListTodo />,
                enabled: checkAllow("map_view"),
                title: "Vazifalar",
            }),
            linkOptions({
                to: "/landing",
                icon: <NotebookText />,
                enabled: true,
                title: "Qo'llanma",
            }),
            linkOptions({
                to: "/requests",
                icon: <ScrollText />,
                enabled: checkAllow("excuse_view"),
                title: "So'rov",
            }),
            linkOptions({
                to: "/plans",
                icon: <WalletMinimal />,
                enabled: checkAllow(
                    "balance_view",
                    "balance_history",
                    "balance_top_up",
                ),
                title: "Balans",
            }),
        ],
        [checkAllow],
    )

    return { links: links?.filter((lnk) => lnk.enabled) }
}
