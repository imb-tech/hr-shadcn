import Header from "@/components/header"
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
    return (
        <div className="w-full h-full overflow-y-auto">
            <div
                className={cn(
                    "fixed top-0 right-0  z-10 transition-[width,height,padding] w-full",
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
            </main>
        </div>
    )
}

export default PageLayout
