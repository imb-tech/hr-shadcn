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
import usePath from "@/hooks/usePath"
import { Link } from "@tanstack/react-router"

export function NavMain() {
    const { links } = usePath()
    const { open } = useSidebar()
    const { data } = useGet<Profile>(GET_ME)

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
                    {links.map(
                        ({ enabled, title, ...item }) =>
                            enabled && (
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
                            ),
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
