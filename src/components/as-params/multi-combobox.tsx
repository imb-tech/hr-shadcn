import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { DEBOUNCETIME } from "@/constants/default"
import { cn } from "@/lib/utils"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { CheckIcon, ChevronDown, X } from "lucide-react"
import { useState } from "react"
import { Skeleton } from "../ui/skeleton"

type ParamComboboxProps<T extends Record<string, any>> = {
    options: T[]
    paramName: string
    label?: string
    disabled?: boolean
    labelKey: keyof T
    valueKey: keyof T
    isError?: boolean
    className?: string
    onSearchChange?: (val: string) => void
    isLoading?: boolean
    skeletonCount?: number
}

export function ParamMultiCombobox<T extends Record<string, any>>({
    options,
    paramName,
    label,
    disabled,
    isError,
    className,
    labelKey,
    valueKey,
    isLoading,
    skeletonCount=5,
    onSearchChange,
}: ParamComboboxProps<T>) {
    const navigate = useNavigate()
    const search: any = useSearch({ from: "/_main" }) as Record<
        string,
        string | undefined
    >
    const currentValues = search[paramName]?.split(",") || []
    const [open, setOpen] = useState(false)

    const handleSelect = (option: T) => {
        const val = option[valueKey]

        const updatedValues = currentValues.includes(val)
            ? currentValues.filter((v: string | number) => v !== val)
            : [...currentValues, val]

        navigate({
            search: {
                ...search,
                [paramName]: updatedValues.length
                    ? updatedValues.join(",")
                    : undefined,
            },
        })
    }

    const handleCancel = () => {
        navigate({ search: { ...search, [paramName]: undefined } })
        setOpen(false)
    }

    const selectedLabels =
        currentValues.length > 0
            ? currentValues
                  ?.map((val: string) => {
                      const found = options?.find(
                          (d) => String(d[valueKey]) === val,
                      )
                      return found?.[labelKey] || val
                  })
                  .join(", ")
            : undefined

    return (
        <Popover modal open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="secondary"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between text-muted-foreground font-normal",
                        currentValues.length && "text-foreground font-medium",
                        isError && "!text-destructive",
                        className,
                    )}
                    disabled={disabled}
                >
                    {currentValues.length > 2
                        ? `${currentValues.length} ta tanlandi`
                        : selectedLabels || label}
                    <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command shouldFilter={onSearchChange ? false : true}>
                    <div className="relative">
                        <CommandInput
                            placeholder={label}
                            onValueChange={(text) => {
                                if (onSearchChange) {
                                    setTimeout(() => {
                                        onSearchChange(text)
                                    }, DEBOUNCETIME)
                                }
                            }}
                        />
                        {currentValues.length > 0 && (
                            <span className="absolute cursor-pointer text-destructive top-1.5 right-1 p-1 z-20">
                                <X
                                    className="text-destructive"
                                    width={16}
                                    onClick={handleCancel}
                                />
                            </span>
                        )}
                    </div>
                    <CommandList>
                        <CommandEmpty>Mavjud emas</CommandEmpty>
                        <CommandGroup>
                            {options?.map((d, i) => (
                                <CommandItem
                                    key={i}
                                    onSelect={() => handleSelect(d)}
                                >
                                    {d[labelKey]}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            currentValues.includes(
                                                String(d[valueKey]),
                                            )
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                </CommandItem>
                            ))}
                            {isLoading ? (
                                <div className="space-y-1">
                                    {Array.from({ length: skeletonCount }).map(
                                        (_, index) => (
                                            <CommandItem
                                                key={index}
                                                className="p-0"
                                            >
                                                <Skeleton className="w-full h-7" />
                                            </CommandItem>
                                        ),
                                    )}
                                </div>
                            ) : null}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
