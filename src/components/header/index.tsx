import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { useNavigate } from "@tanstack/react-router"
import { LogOut, User } from "lucide-react"
import { ThemeColorToggle } from "./color-toggle"
import { SidebarTrigger } from "../ui/sidebar"
import { ReactNode } from "react"
import HeaderLinks from "./header-links"
import { useGet } from "@/hooks/useGet"
import { GET_ME } from "@/constants/api-endpoints"
import getPlan from "@/lib/get-plan"
import Spinner from "../ui/spinner"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { Button } from "../ui/button"

const Header = ({
    items,
    rightComponent,
    leftComponent,
}: {
    items?: string[]
    rightComponent?: ReactNode
    leftComponent?: ReactNode
}) => {
    const { data, isLoading } = useGet<Profile>(GET_ME)
    const navigate = useNavigate()

    const logOut = () => {
        localStorage.clear()
        navigate({ to: "/auth" })
    }

    return (
        <header className="py-3 pr-3 pl-2 gap-4 dark:border-b  flex items-center justify-between bg-card max-w-full box-border">
            <div className="flex gap-6 items-center  max-w-full  custom-scrollbar">
                <div className="flex gap-3 items-center sm:min-w-[180px]">
                    <SidebarTrigger className="text-gray-500 dark:text-white" />
                    <span className="text-2xl text-primary font-bold sm:block hidden">
                        IMB HR
                    </span>
                </div>

                <div className="w-full ">
                    <HeaderLinks />
                </div>
                {!!leftComponent && (
                    <div className="flex gap-2">{leftComponent}</div>
                )}
                {/* <HeaderBreadvrumb items={items ?? []} /> */}
            </div>
            <hgroup className="flex items-center gap-4">
                {!!rightComponent && (
                    <div className="flex gap-2">{rightComponent}</div>
                )}

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="secondary">
                            <p>{getPlan(data?.employees_count)}</p>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="p-4">
                        <p>Hozirda sizda 120ta hodim mavjud</p>
                        <p>Keyingi oy to'lovingiz 300 000 so'm</p>
                    </TooltipContent>
                </Tooltip>
                <ThemeColorToggle />
                <DropdownMenu>
                    <div className="relative h-10">
                        <DropdownMenuTrigger className="!outline-none">
                            <Avatar className="relative overflow-hidden">
                                {isLoading && (
                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/80">
                                        <Spinner size="sm" />
                                    </div>
                                )}
                                <AvatarImage
                                    src={undefined}
                                    alt="user img"
                                    className="object-cover"
                                />
                                <AvatarFallback className="!bg-primary/10 !text-primary hover:!bg-primary/5">
                                    {data?.first_name?.slice(0, 1)}
                                    {data?.last_name?.slice(0, 1)}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                    </div>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem
                            className="cursor-pointer flex items-center gap-2"
                            asChild
                        >
                            <div className="flex items-center gap-2">
                                <User size={18} />
                                {data?.first_name && data?.last_name ? (
                                    <p className="font-medium">
                                        {data?.first_name} {data?.last_name}
                                    </p>
                                ) : (
                                    <p className="font-medium ">
                                        {data?.username}
                                    </p>
                                )}
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer flex items-center gap-2 !text-red-500"
                            onClick={logOut}
                        >
                            <LogOut width={16} /> Chiqish
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </hgroup>
        </header>
    )
}

export default Header
