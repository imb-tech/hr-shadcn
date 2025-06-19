import Header from "@/components/header"
import { cn } from "@/lib/utils"
import { ReactNode } from "@tanstack/react-router"

type Props = {
    children: ReactNode
    rigthChildren?: ReactNode
    leftChildren?: ReactNode
}

const PageLayout = ({ children, rigthChildren, leftChildren }: Props) => {
    return (
        <div className="w-full h-full overflow-y-auto">
            <div
                className={cn(
                    "fixed top-0 right-0  z-10 transition-[width,height,padding] w-full",
                )}
            >
                <Header
                    rigthChildren={rigthChildren}
                    leftChildren={leftChildren}
                />
            </div>
            <main className="flex xl:gap-2 px-3 md:px-4 pt-20 pb-4  relative h-full">
                {children}
            </main>
        </div>
    )
}

export default PageLayout
