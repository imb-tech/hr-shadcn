import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, CalendarProps } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({
    date,
    setDate,
    placeholder,
    fullWidth,
    disabled,
    calendarProps,
    defaultValue,
    isError,
    size = "lg",
    variant = "secondary",
    titleHidden = true,
}: {
    date: Date | any
    setDate: any
    placeholder?: string
    fullWidth?: boolean
    disabled?: boolean
    calendarProps?: CalendarProps | undefined
    defaultValue?: Date
    isError?: boolean
    size?: "default" | "lg" | "sm" | "icon"
    variant?: "secondary" | "default"
    titleHidden?: boolean
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    size={size}
                    variant={variant}
                    className={cn(
                        "justify-start text-left font-normal w-full",
                        !date && "text-muted-foreground",
                        fullWidth && "w-full",
                        isError && "border-destructive",
                        titleHidden && "sm:w-[280px]",
                        !titleHidden && date && "w-[150px]",
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon
                        className={cn(
                            "text-muted-foreground h-4 w-4 ",
                            date && "mr-1 ",
                            !titleHidden && "text-primary"
                        )}
                    />
                    {date
                        ? format(date, "dd/MM/yyyy")
                        : titleHidden && (
                              <span className="text-muted-foreground">
                                  {placeholder || "Kunni tanlang"}
                              </span>
                          )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    {...calendarProps}
                    mode="single"
                    selected={new Date(date || (defaultValue as Date))}
                    onSelect={(newDate) =>
                        setDate(format(new Date(newDate as Date), "yyyy-MM-dd"))
                    }
                />
            </PopoverContent>
        </Popover>
    )
}
