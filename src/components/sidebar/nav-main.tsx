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
        <SidebarGroup className="lg:pt-[70px]">
            <SidebarGroupContent className="flex flex-col gap-2 ">
                <SidebarMenu>
                    <SidebarMenuItem className="mb-3 lg:hidden">
                        <div className="flex gap-3 items-center min-w-[180px]">
                            <SidebarTrigger className="text-gray-500 dark:text-white" />
                            <span className="text-2xl text-primary font-bold">
                                IMB TECH
                            </span>
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
                                            "[&_button]:bg-primary hover:[&_button]:bg-primary hover:[&_button]:text-primary-foreground text-primary-foreground",
                                    }}
                                    className="rounded-lg"
                                >
                                    <SidebarMenuItem>
                                        <SidebarMenuButton tooltip={title}>
                                            {item.icon}
                                            <span>{title}</span>
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
