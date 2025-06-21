import Header from "@/components/header"
import MenuItemMobile from "@/components/sidebar/menu-item-mobile"
import { SkeletionNav } from "@/components/sidebar/nav-main"
import usePermissions from "@/hooks/use-permissions"
import usePath from "@/hooks/usePath"
import { cn } from "@/lib/utils"
import { ReactNode } from "@tanstack/react-router"

type Props = {
    children: ReactNode
    breadcrumb?: string[]
    rightComponent?: ReactNode
    leftComponent?: ReactNode
}

const PageLayout = ({
    children,
    breadcrumb,
    rightComponent,
    leftComponent,
}: Props) => {
    const { links } = usePath()
    const { isLoading } = usePermissions()

    return (
        <div className="w-full h-full overflow-y-auto">
            <div
                className={cn(
                    "fixed top-0 right-0 z-10 transition-[width,height,padding] w-full",
                )}
            >
                <Header
                    items={breadcrumb}
                    rightComponent={rightComponent}
                    leftComponent={leftComponent}
                />
            </div>
            <main className=" mx-auto p-4 h-full overflow-y-auto pt-20">
                {children}

                {isLoading ?
                    <SkeletionNav className="grid grid-cols-7 lg:hidden h-16 items-center border-t border-t-default w-full fixed left-0 ring-0 bottom-0 bg-background z-40 px-3"/>
                :   <nav className="grid grid-cols-7 lg:hidden h-16 items-center border-t border-t-default w-full fixed left-0 ring-0 bottom-0 bg-background z-40">
                        {links?.map((link, i) => (
                            <MenuItemMobile
                                badge={link.to === "/" ? Number(0) : undefined}
                                key={i}
                                {...link}
                            />
                        ))}
                    </nav>
                }
                {/* {isLoading && (
                    <div className="flex items-center justify-center h-screen fixed z-[10000] w-full top-0 left-0 bg-background/90">
                        <div
                            className="flex justify-start  items-center gap-1  transition-none duration-150"
                            color="foreground"
                        >
                            <img
                                alt="logo"
                                src="/images/logo.png"
                                width={100}
                            />
                            <p className="font-bold text-3xl text-inherit">
                                IMB HR
                            </p>
                        </div>
                    </div>
                )} */}
            </main>
        </div>
    )
}

export default PageLayout
