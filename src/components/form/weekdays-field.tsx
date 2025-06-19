import { cn } from "@/lib/utils"
import { useCallback, useMemo } from "react"
import {
    FieldValues,
    Path,
    PathValue,
    useController,
    useFormContext,
} from "react-hook-form"

type Props<IForm extends FieldValues> = {
    name: Path<IForm>
    label?: string
    wrapperClassName?: string
    required?: boolean
    itemClassName?: string
}

export default function WeekdaysFields<T extends FieldValues>({
    name,
    label,
    wrapperClassName,
    required = false,
    itemClassName,
}: Props<T>) {
    type Value = PathValue<T, Path<T> & (string | undefined)>
    const methods = useFormContext<T>()
    const watchV = methods.watch(name)

    const currentValue: number[] = useMemo(
        () => (watchV?.length ? watchV : []),
        [watchV],
    )
    const {
        fieldState: { invalid, error },
    } = useController({
        name,
        control: methods.control,
        rules: { required },
    })

    const handleChange = useCallback(
        (v: number) => {
            methods.clearErrors(name)
            const set: Set<number> = new Set(currentValue)

            if (set.has(v)) {
                set.delete(v)
            } else {
                set.add(v)
            }

            const value = Array.from(set) as Value

            methods.setValue(name, value)
        },
        [currentValue],
    )

    const reg = methods.register(name, {
        required: {
            value: required,
            message: `${label ?? ""} majburiy`,
        },
    })

    return (
        <fieldset
            className={cn("flex flex-col gap-1 w-full", wrapperClassName)}
        >
            <label htmlFor={name}>{label}</label>
            <input
                type="hidden"
                {...reg}
                value={currentValue.join(",") || ""}
            />
            <div className="flex gap-2" id={name}>
                {[1, 2, 3, 4, 5, 6, 7]?.map((v) => (
                    <button
                        key={v}
                        className={cn(
                            "cursor-pointer bg-default-100 py-1 rounded-md select-none w-10 sm:w-12 text-center capitalize",
                            v === 7 ? "text-red-400 bg-red-400/10" : "",
                            currentValue?.includes(v) ?
                                "bg-blue-400 text-white"
                            :   "",
                            itemClassName,
                        )}
                        type="button"
                        onClick={() => handleChange(v)}
                    >
                        {work_days[v - 1]}
                    </button>
                ))}
            </div>
            {invalid && (
                <span className="text-sm text-rose-500">{error?.message}</span>
            )}
        </fieldset>
    )
}

export const work_days: string[] = [
    "du",
    "se",
    "chor",
    "pay",
    "ju",
    "sha",
    "yak",
]
