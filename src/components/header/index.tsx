import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Link, useNavigate } from "@tanstack/react-router"
import { LogOut, User } from "lucide-react"
import { ThemeColorToggle } from "./color-toggle"
import { SidebarTrigger } from "../ui/sidebar"
import { ReactNode } from "react"
import HeaderLinks from "./header-links"
import { ParamCombobox } from "../as-params/combobox"

type Props = {
    title?: string
    rigthChildren?: ReactNode
    leftChildren?: ReactNode
}
const Header = ({ rigthChildren, leftChildren }: Props) => {
    const navigate = useNavigate()

    const handleLogOut = () => {
        navigate({ to: "/auth" })
        localStorage.removeItem("token")
        localStorage.clear()
        localStorage.removeItem("refresh")
    }

    return (
        <header className="py-3 pr-3 pl-2 gap-4 dark:border-b  flex items-center justify-between bg-card max-w-full box-border">
            <div className="flex gap-6 items-center  max-w-full  custom-scrollbar">
                <div className="flex gap-3 items-center sm:min-w-[180px]">
                    <SidebarTrigger className="text-gray-500 dark:text-white" />
                    <span className="text-2xl text-primary font-bold sm:block hidden">
                        IMB TECH
                    </span>
                </div>
                <div className="w-full ">
                    <HeaderLinks />
                </div>
                {leftChildren ? leftChildren : null}
            </div>
            <hgroup className="flex items-center gap-4">
                {rigthChildren ? rigthChildren : null}
                <ParamCombobox
                    className="w-full"
                    options={[
                        { label: "Toshkent Index ", value: "imb" },
                        { label: "Toshkent City", value: "imb" },
                        { label: "Toshkent Yakkasaroy", value: "imb" },
                    ]}
                    isSearch={false}
                    paramName="branch"
                    label="Barcha filiallar"
                />
                <ThemeColorToggle />
                <DropdownMenu>
                    <div className="relative h-10">
                        <DropdownMenuTrigger className="!outline-none">
                            <Avatar className="relative overflow-hidden">
                                {/* {
                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/80">
                                        <Spinner size="sm" />
                                    </div>
                                } */}
                                <AvatarImage
                                    src={undefined}
                                    alt="user img"
                                    className="object-cover"
                                />
                                <AvatarFallback className="!bg-primary/10 !text-primary hover:!bg-primary/5">IMB</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                    </div>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem
                            className="cursor-pointer flex items-center gap-2"
                            asChild
                        >
                            <Link to="/">
                                <User width={16} /> IMB CEO
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer flex items-center gap-2 !text-red-500"
                            onClick={handleLogOut}
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
