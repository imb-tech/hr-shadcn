import { Controller, Control, FieldValues, Path } from "react-hook-form"
import FieldLabel from "./form-label"
import FieldError from "./form-error"
import { MultiCombobox as ShadcnCombobox } from "@/components/ui/multi-combobox"
import { getNestedValue } from "./input"

type ComboboxProps<T extends FieldValues> = {
    name: Path<T>
    label?: string
    placeholder?: string
    options: T[] | undefined
    disabled?: boolean
    required?: boolean
    control: Control<T>
    hideError?: boolean
    onAdd?: () => void
    labelKey?: keyof T
    valueKey?: keyof T
    skeletonCount?: number
    isLoading?: boolean
    onSearchChange?: (val: string) => void
}

export function FormMultiCombobox<T extends FieldValues>({
    name,
    label,
    options,
    disabled,
    placeholder,
    required,
    control,
    hideError = true,
    valueKey,
    labelKey,
    onAdd,
    isLoading,
    skeletonCount,
    onSearchChange,
}: ComboboxProps<T>) {
    const error = getNestedValue(control._formState.errors, name)
    return (
        <div>
            {label && (
                <FieldLabel
                    htmlFor={name}
                    required={!!required}
                    isError={!!error}
                >
                    {label}
                </FieldLabel>
            )}
            <Controller
                name={name}
                control={control}
                rules={
                    required
                        ? { required: `${label || name}ni kiriting` }
                        : {}
                }
                render={({ field }) => (
                    <div className="pt-0.5">
                        <ShadcnCombobox
                            options={options}
                            values={field.value}
                            setValues={field.onChange}
                            label={placeholder || label || "Tanlang"}
                            disabled={control._formState.disabled || disabled}
                            isError={!!error}
                            onAdd={onAdd}
                            valueKey={valueKey}
                            labelKey={labelKey}
                            isLoading={isLoading}
                            skeletonCount={skeletonCount}
                            onSearchChange={onSearchChange}
                        />
                    </div>
                )}
            />
            {!hideError && error && (
                <FieldError>
                    {control._formState.errors[name]?.message as string}
                </FieldError>
            )}
        </div>
    )
}
