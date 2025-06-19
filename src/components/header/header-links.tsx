import { menuItems } from "@/constants/menu"
import { useLocation, useNavigate } from "@tanstack/react-router"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

export default function HeaderLinks() {
    const { pathname } = useLocation()
    const items = findChildPaths(menuItems, pathname)
    const navigate = useNavigate()

    const isSomeActive = (path: string) => {
        if (pathname?.split("/")?.length > 2) {
            return path?.slice(1) === pathname?.split("/")[1]
        } else {
            return false
        }
    }

    return (
        <div> 
            {!!items.length && (
                <Tabs
                    value={pathname}
                    onValueChange={(path) => navigate({ to: path })}
                >
                    <TabsList>
                        {items?.map((link) => (
                            <TabsTrigger
                                key={link.title}
                                value={link.to}
                                className={`${
                                    pathname.includes(link.to + "/") &&
                                    "!bg-primary !text-primary-foreground"
                                } font-medium flex items-center gap-2 ${
                                    isSomeActive(link.to) && "!bg-primary/50"
                                }`}
                            >
                                {link.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            )}
        </div>
    )
}

const findChildPaths = (filteredItems: typeof menuItems, pathname: string) => {
    const currentSection = pathname?.split("/")?.[1]

    return (
        filteredItems?.find(
            (item) =>
                item.items?.find(
                    (subItem) => subItem.to?.slice(1) === currentSection,
                ) || item.to?.slice(1) === currentSection,
        )?.items || []
    )
}
