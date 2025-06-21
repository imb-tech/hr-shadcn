import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import usePermissions from "@/hooks/use-permissions"
import usePath from "@/hooks/usePath"
import { Link } from "@tanstack/react-router"
import { Skeleton } from "../ui/skeleton"
import { memo } from "react"
import { cn } from "@/lib/utils"

export const SkeletionNav = memo(
    ({ isopen, className }: { isopen?: boolean; className?: string }) => {
        return (
            <div className={cn("flex flex-col gap-6 pt-1", className)}>
                {Array.from({ length: 7 }).map((_, i) => (
                    <div className="flex items-center gap-4 pl-3" key={i}>
                        <Skeleton className="min-w-6 h-6 rounded-sm" />
                        {isopen && (
                            <Skeleton className="w-full h-6 rounded-sm" />
                        )}
                    </div>
                ))}
            </div>
        )
    },
)

export function NavMain() {
    const { isLoading } = usePermissions()
    const { links } = usePath()

    const { open } = useSidebar()

    return (
        <SidebarGroup className={"lg:pt-[74px]"}>
            <SidebarGroupContent className="flex flex-col gap-2 ">
                <SidebarMenu>
                    <SidebarMenuItem className="mb-3 lg:hidden">
                        <div className="flex gap-3 items-center min-w-[180px]">
                            <SidebarTrigger className="text-gray-500 dark:text-white" />
                            <Link
                                className="flex justify-start  items-center gap-1"
                                color="foreground"
                                to="/"
                            >
                                <img
                                    alt="logo"
                                    src="/images/logo.png"
                                    width={50}
                                />
                                <p className="font-bold text-inherit whitespace-nowrap">
                                    IMB HR
                                </p>
                            </Link>
                        </div>
                    </SidebarMenuItem>
                    {isLoading ?
                        <SkeletionNav isopen={open} />
                    :   links.map(({ enabled, title, ...item }) => (
                            <Link
                                {...item}
                                key={title}
                                activeProps={{
                                    className:
                                        "[&_button]:bg-primary/10  hover:[&_button]:bg-primary/15 hover:[&_button]:text-primary text-primary",
                                }}
                                className="rounded-lg "
                            >
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        className="flex items-center gap-4"
                                        tooltip={title}
                                    >
                                        {item.icon}
                                        {title}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </Link>
                        ))
                    }
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
