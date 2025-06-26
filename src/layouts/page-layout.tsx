import Header from "@/components/header"
import { cn } from "@/lib/utils"
import { ReactNode } from "@tanstack/react-router"
import { ClassNameValue } from "tailwind-merge"

type Props = {
    children: ReactNode
    rightComponent?: ReactNode
    leftComponent?: ReactNode
    className?: ClassNameValue
    style?: any
}

const PageLayout = ({
    children,
    rightComponent,
    leftComponent,
    className,
    style,
}: Props) => {
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
            <main
                style={style}
                className={cn(
                    " mx-auto p-4 h-full overflow-y-auto  pt-20",
                    className,
                )}
            >
                {children}
            </main>
        </div>
    )
}

export default PageLayout
