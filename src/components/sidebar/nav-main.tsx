import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import { GET_ME } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import usePermissions from "@/hooks/use-permissions"
import usePath from "@/hooks/usePath"
import { Link } from "@tanstack/react-router"
import { Skeleton } from "../ui/skeleton"
import { memo } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

export const SkeletionNav = memo(({ isopen }: { isopen?: boolean }) => {
    return Array.from({ length: 7 }).map((_, i) => (
        <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center gap-4">
                <Skeleton className="w-8  h-full rounded-sm" />
                {isopen && <Skeleton className="w-full h-full rounded-sm" />}
            </SidebarMenuButton>
        </SidebarMenuItem>
    ))
})

export function NavMain() {
    const { links } = usePath()
    const { open, toggleSidebar } = useSidebar()
    const mobile = useIsMobile()
    const { data } = useGet<Profile>(GET_ME)
    const { isLoading } = usePermissions()

    return (
        <SidebarGroup className={"lg:pt-[74px]"}>
            <SidebarGroupContent className="flex flex-col gap-2 ">
                <SidebarMenu>
                    <SidebarMenuItem className="mb-3 lg:hidden">
                        <div className="flex  items-center min-w-[180px]">
                            <SidebarTrigger className="text-gray-500 dark:text-white" />
                            <Link
                                className="flex justify-start  items-center gap-1"
                                color="foreground"
                                to="/"
                            >
                                <img
                                    alt="logo"
                                    src="/images/logo.png"
                                    width={40}
                                />
                                <p className="font-bold text-inherit whitespace-nowrap">
                                    IMB HR
                                </p>
                            </Link>
                        </div>
                    </SidebarMenuItem>
                    {isLoading ? (
                        <SkeletionNav isopen={open} />
                    ) : (
                        links.map(({ title, ...item }) => (
                            <Link
                                {...item}
                                key={title}
                                activeProps={{
                                    className:
                                        "[&_button]:bg-primary/10  hover:[&_button]:bg-primary/10 hover:[&_button]:text-primary text-primary",
                                }}
                                className="rounded-lg "
                            >
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        className="flex items-center gap-4"
                                        tooltip={title}
                                        onClick={() => {
                                            if (mobile) toggleSidebar()
                                        }}
                                    >
                                        {item.icon}
                                        <span>{title}</span>
                                    </SidebarMenuButton>

                                    {item.to === "/requests" &&
                                    open &&
                                    data?.excuses ? (
                                        <span className="absolute text-xs right-2 top-[50%] translate-y-[-50%] size-6 z-50 flex items-center justify-center bg-primary/15 rounded-full text-primary ">
                                            {data?.excuses}
                                        </span>
                                    ) : (
                                        ""
                                    )}
                                </SidebarMenuItem>
                            </Link>
                        ))
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
