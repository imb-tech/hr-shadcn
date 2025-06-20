import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import usePath from "@/hooks/usePath"
import { Link } from "@tanstack/react-router"

export function NavMain() {
    const { links } = usePath()

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
                    {links.map(
                        ({ enabled, title, ...item }) =>
                            enabled && (
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
                            ),
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
