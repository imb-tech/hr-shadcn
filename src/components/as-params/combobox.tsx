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
import { cn } from "@/lib/utils"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { CheckIcon, ChevronDown, X } from "lucide-react"
import { useEffect, useState } from "react"

type ParamComboboxProps<T extends Record<string, any>> = {
    options: T[]
    paramName: string
    label?: string
    disabled?: boolean
    labelKey?: keyof T
    valueKey?: keyof T
    isError?: boolean
    className?: string
    asloClear?: string[]
    defaultOpt?: T
    isSearch?: boolean
}

export function ParamCombobox<T extends Record<string, any>>({
    options,
    paramName,
    label,
    disabled = false,
    isError = false,
    className,
    asloClear = [],
    defaultOpt,
    labelKey = "label",
    valueKey = "value",
    isSearch = true,
}: ParamComboboxProps<T>) {
    const navigate = useNavigate()
    const search: any = useSearch({ from: "/_main" }) as Record<
        string,
        string | undefined
    >
    const currentValue = search[paramName]
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (defaultOpt) {
            navigate({
                search: {
                    ...search,
                    [paramName]: String(defaultOpt[valueKey]),
                },
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultOpt])

    const handleSelect = (option: T) => {
        const returnValue = option[valueKey]
        const updatedSearch = { ...search } as Record<
            string,
            string | undefined
        >
        updatedSearch[paramName] = String(returnValue)

        asloClear.forEach((key) => {
            delete updatedSearch[key]
        })

        navigate({
            to: location.pathname,
            search: updatedSearch,
        })
        setOpen(false)
    }

    const handleCancel = () => {
        const updatedSearch = { ...search, [paramName]: undefined }
        asloClear.forEach((param) => {
            updatedSearch[param] = undefined
        })
        navigate({ search: updatedSearch })
        setOpen(false)
    }

    const selectedOption = options?.find((d) => d[valueKey] == currentValue)

    const sortedOptions = options?.sort((a, b) => {
        const isASelected = a[valueKey] == currentValue
        const isBSelected = b[valueKey] == currentValue
        return isASelected === isBSelected ? 0 : isASelected ? -1 : 1
    })


    return (
        <Popover modal open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="secondary"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-max  justify-between font-normal ",
                        currentValue && "font-medium !text-white",
                        isError && "!text-destructive",
                        className,
                    )}
                    disabled={disabled}
                >
                    {selectedOption?.[labelKey] ?? label}
                    <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <div className="relative">
                        {isSearch && (
                            <>
                                <CommandInput placeholder={label} autoFocus={false}  />
                                {currentValue && (
                                    <span className="absolute cursor-pointer text-red-600 top-1.5 right-1 p-1">
                                        <X
                                            width={16}
                                            onClick={handleCancel}
                                        />
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                    <CommandList>
                        <CommandEmpty>Mavjud emas</CommandEmpty>
                        <CommandGroup>
                            {sortedOptions.map((d, i) => {
                                const optionValue = d[valueKey]
                                return (
                                    <CommandItem
                                        key={i}
                                        onSelect={() => handleSelect(d)}
                                        className="text-nowrap"
                                    >
                                        
                                        {d[labelKey]}
                                        <CheckIcon
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                String(currentValue) ===
                                                    String(optionValue)
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                            )}
                                        />
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
