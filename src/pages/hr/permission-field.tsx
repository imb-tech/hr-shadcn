import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useGet } from "@/hooks/useGet"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"

type Module = {
    name: string
    actions: {
        name: string
        code: string
    }[]
}

export default function PermissionField({
    defaultIsSite = false,
}: {
    defaultIsSite?: boolean
}) {
    const { data } = useGet<Module[]>("users/modules")
    const [isSite, setIsSite] = useState<boolean>(defaultIsSite)
    const form = useFormContext<Human>()

    // Formdagi actions holatini realtime kuzatish
    const actions = useWatch({
        control: form.control,
        name: "actions",
        defaultValue: [],
    })

    // Child action qiymatini boshqarish
    const handleActionChange = (code: string, checked: boolean) => {
        const updatedActions =
            checked ?
                [...(actions ?? []), code]
            :   actions?.filter((c) => c !== code)

        form.setValue("actions", updatedActions)
    }

    // Modul holati: kamida bitta action tanlanganmi
    const isModuleChecked = (mod: Module) =>
        mod.actions.some((act) => actions?.includes(act.code))

    // Modulga barcha child-larni qo‘shish / olib tashlash
    const handleModuleChange = (mod: Module, checked: boolean) => {
        const actionCodes = mod.actions.map((act) => act.code)

        const updatedActions =
            checked ?
                [...new Set([...(actions ?? []), ...actionCodes])]
            :   actions?.filter((c) => !actionCodes.includes(c))

        form.setValue("actions", updatedActions)
    }

    const isActionChecked = (code: string) => actions?.includes(code)

    function handleSwitch(v: boolean) {
        setIsSite(v)
        if (!v) {
            form.setValue("actions", undefined)
        }
    }

    return (
        <div>
            <div className="flex items-center gap-5">
                <div className="bg-gray-500/20 flex items-center gap-2 rounded-2xl p-3 px-4">
                    <Switch checked disabled />
                    <Label>Mobil ilovaga ruxsat</Label>
                </div>
                <div className="bg-gray-500/20 flex items-center gap-2 rounded-2xl p-3 px-4">
                    <Switch
                        id="allow-site"
                        onCheckedChange={handleSwitch}
                        checked={isSite}
                    />
                    <Label htmlFor="allow-site">Saytga kirishga ruxsat</Label>
                </div>
            </div>

            {isSite && (
                <div className="mt-3 grid lg:grid-cols-4 sm:grid-cols-2 gap-3 transition-all duration-300 ease-linear">
                    {data?.map((mod) => (
                        <div
                            className="bg-gray-500/20 rounded-xl p-4"
                            key={mod.name}
                        >
                            <Label className="flex items-center gap-2">
                                <Checkbox
                                    checked={isModuleChecked(mod)}
                                    onCheckedChange={(checked) =>
                                        handleModuleChange(mod, !!checked)
                                    }
                                />
                                <span>{mod.name}</span>
                            </Label>

                            <div
                                className={cn(
                                    "flex flex-col gap-2 pl-4 mt-4",
                                    !mod?.actions.length ? "hidden" : "",
                                )}
                            >
                                {mod?.actions.map((act) => (
                                    <Label
                                        key={act.code}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox
                                            checked={isActionChecked(act.code)}
                                            onCheckedChange={(checked) =>
                                                handleActionChange(
                                                    act.code,
                                                    !!checked,
                                                )
                                            }
                                        />
                                        <span>{act.name}</span>
                                    </Label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
