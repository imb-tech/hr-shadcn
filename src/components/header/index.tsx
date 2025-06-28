import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Link, useNavigate } from "@tanstack/react-router"
import { LogOut, Moon, Sun, User } from "lucide-react"
import { SidebarTrigger } from "../ui/sidebar"
import { ReactNode } from "react"
import { useGet } from "@/hooks/useGet"
import { GET_ME } from "@/constants/api-endpoints"
import getPlan from "@/lib/get-plan"
import Spinner from "../ui/spinner"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "@/layouts/theme"
import { useTranslation } from "react-i18next"

const Header = ({
    rightComponent,
    leftComponent,
}: {
    rightComponent?: ReactNode
    leftComponent?: ReactNode
}) => {
    const { data, isLoading } = useGet<Profile>(GET_ME)
    const navigate = useNavigate()
    const { theme, setTheme } = useTheme()

    const logOut = () => {
        localStorage.clear()
        navigate({ to: "/auth" })
    }
    const { i18n } = useTranslation()

    return (
        <header className="py-[10px] pr-3 pl-2 gap-4 border-b  flex items-center justify-between bg-background  max-w-full box-border">
            <div className="flex gap-6 items-center  max-w-full  custom-scrollbar">
                <div className={cn("flex sm:gap-3  items-center")}>
                    <div>
                        <SidebarTrigger className="text-gray-500 dark:text-white" />
                    </div>
                    <Button onClick={() => i18n.changeLanguage("ru")}>
                        RU
                    </Button>
                    <Link
                        className="flex justify-start  items-center gap-1"
                        color="foreground"
                        to="/"
                    >
                        <img alt="logo" src="/images/logo.png" width={40} />
                        <p className="font-bold text-inherit whitespace-nowrap">
                            IMB HR
                        </p>
                    </Link>
                </div>

                {!!leftComponent && (
                    <div className="flex gap-2">{leftComponent}</div>
                )}
            </div>
            <hgroup className="flex items-center gap-4">
                {!!rightComponent && (
                    <div className="flex gap-2">{rightComponent}</div>
                )}

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button>
                            <p>{getPlan(data?.employees_count)}</p>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="p-4">
                        <p>Hozirda sizda 120ta hodim mavjud</p>
                        <p>Keyingi oy to'lovingiz 300 000 so'm</p>
                    </TooltipContent>
                </Tooltip>
                <DropdownMenu>
                    <div className="relative h-10">
                        <DropdownMenuTrigger className="!outline-none">
                            <Avatar className="relative overflow-hidden">
                                {isLoading && (
                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-primary/15">
                                        <Spinner size="sm" />
                                    </div>
                                )}
                                <AvatarImage
                                    src={undefined}
                                    alt="user img"
                                    className="object-cover"
                                />
                                <AvatarFallback className="!bg-primary/10 !text-primary hover:!bg-primary/20">
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
                                {data?.first_name && data?.last_name ?
                                    <p className="font-medium">
                                        {data?.first_name} {data?.last_name}
                                    </p>
                                :   <p className="font-medium ">
                                        {data?.username}
                                    </p>
                                }
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                if (theme === "light") {
                                    setTheme("dark")
                                } else {
                                    setTheme("light")
                                }
                            }}
                            className="cursor-pointer flex items-center gap-2   "
                        >
                            {theme === "light" ?
                                <span className="flex items-center gap-2">
                                    <Sun width={18} /> Kun{" "}
                                </span>
                            :   <span className="flex items-center gap-2">
                                    <Moon width={18} /> Tun
                                </span>
                            }
                        </DropdownMenuItem>
                        <div className="w-full border-[0.5px] my-1"></div>
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
