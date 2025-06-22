import Header from "@/components/header"
// import MenuItemMobile from "@/components/sidebar/menu-item-mobile"
// import { Button } from "@/components/ui/button"
// import { Skeleton } from "@/components/ui/skeleton"
// import usePermissions from "@/hooks/use-permissions"
// import usePath from "@/hooks/usePath"
import { cn } from "@/lib/utils"
import { ReactNode } from "@tanstack/react-router"
// import { memo } from "react"

type Props = {
    children: ReactNode
    rightComponent?: ReactNode
    leftComponent?: ReactNode
}

// const SkeletionNav = memo(
//     ({ isopen, className }: { isopen?: boolean; className?: string }) => {
//         return (
//             <div className={cn("flex flex-col gap-6 pt-1", className)}>
//                 {Array.from({ length: 7 }).map((_, i) => (
//                     <Button
//                         color="default"
//                         variant="ghost"
//                         className="relative z-50"
//                     >
//                         <Skeleton className="min-w-6 h-6 rounded-sm" />
//                         {isopen && (
//                             <Skeleton className="w-full h-6 rounded-sm" />
//                         )}
//                     </Button>
//                 ))}
//             </div>
//         )
//     },
// )

const PageLayout = ({
    children,
    rightComponent,
    leftComponent,
}: Props) => {
    // const { links } = usePath()
    // const { isLoading } = usePermissions()

    return (
        <div className="w-full h-full overflow-y-auto">
            <div
                className={cn(
                    "fixed top-0 right-0 z-10 transition-[width,height,padding] w-full",
                )}
            >
                <Header
                    rightComponent={rightComponent}
                    leftComponent={leftComponent}
                />
            </div>
            <main className=" mx-auto px-4 h-full overflow-y-auto lg:pb-4  pt-20">
                {children}

                {/* {isLoading ? (
                    <SkeletionNav className="grid grid-cols-7 lg:hidden h-16 items-center border-t border-t-default w-full fixed left-0 ring-0 bottom-0 bg-background z-40 px-3" />
                ) : (
                    <nav className="grid grid-cols-7 lg:hidden h-16 items-center border-t border-t-default w-full fixed left-0 ring-0 bottom-0 bg-background z-40">
                        {links?.map((link, i) => (
                            <MenuItemMobile
                                badge={
                                    link.to === "/office"
                                        ? Number(0)
                                        : undefined
                                }
                                key={i}
                                {...link}
                            />
                        ))}
                    </nav>
                )} */}
            </main>
        </div>
    )
}

export default PageLayout
