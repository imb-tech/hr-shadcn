import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import Spinner from "./spinner"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 gap-1",
    {
        variants: {
            variant: {
                default:
                    "bg-primary/10 text-primary hover:bg-primary/15",
                destructive:
                    "bg-red-500/10 text-red-600 hover:bg-red-500/15",
                outline:
                    "border border-input dark:bg-background  hover:text-primary",
                secondary: "dark:!bg-secondary bg-zinc-200   !text-muted-foreground dark:hover:!bg-secondary/90",
                ghost: "hover:bg-primary/10 hover:text-primary",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 rounded-md px-3 gap-1",
                lg: "h-10 rounded-md px-4",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
    loading?: boolean
    disabled?: boolean
    icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            loading,
            disabled,
            icon,
            ...props
        },
        ref,
    ) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(
                    buttonVariants({
                        variant,
                        size:
                            size ? size
                            : props.children ? "default"
                            : "icon",
                        className,
                    }),
                )}
                ref={ref}
                {...props}
                disabled={loading || disabled}
            >
                {loading && (
                    <Spinner
                        color={
                            variant === "destructive" ? "secondary"
                            : variant === "secondary" ?
                                "primary"
                            :   "primary-foreground"
                        }
                        size="sm"
                    />
                )}{" "}
                {!loading && icon} {props.children}
            </Comp>
        )
    },
)
Button.displayName = "Button"

export { Button, buttonVariants }
