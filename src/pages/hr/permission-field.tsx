import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useGet } from "@/hooks/useGet";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

type Module = {
  name: string;
  actions: {
    name: string;
    code: string;
  }[];
};

export default function PermissionField({
  defaultIsSite = false,
}: {
  defaultIsSite?: boolean;
}) {
  const { data } = useGet<Module[]>("users/modules");
  const [isSite, setIsSite] = useState<boolean>(defaultIsSite);
  const form = useFormContext<Human>();

  // Formdagi actions holatini realtime kuzatish
  const actions = useWatch({
    control: form.control,
    name: "actions",
    defaultValue: [],
  });

  // Child action qiymatini boshqarish
  const handleActionChange = (code: string, checked: boolean) => {
    const updatedActions = checked
      ? [...(actions ?? []), code]
      : actions?.filter((c) => c !== code);

    form.setValue("actions", updatedActions);
  };

  // Modul holati: kamida bitta action tanlanganmi
  const isModuleChecked = (mod: Module) =>
    mod.actions.some((act) => actions?.includes(act.code));

  // Modulga barcha child-larni qo‘shish / olib tashlash
  const handleModuleChange = (mod: Module, checked: boolean) => {
    const actionCodes = mod.actions.map((act) => act.code);

    const updatedActions = checked
      ? [...new Set([...(actions ?? []), ...actionCodes])]
      : actions?.filter((c) => !actionCodes.includes(c));

    form.setValue("actions", updatedActions);
  };

  const isActionChecked = (code: string) => actions?.includes(code);

  function handleSwitch(v: boolean) {
    setIsSite(v);
    if (!v) {
      form.setValue("actions", undefined);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-5">
        {/* <div className="bg-gray-500/20 rounded-2xl p-3 px-4">
          <Switch size="sm" isSelected isDisabled>
            Mobil ilovaga ruxsat
          </Switch>
        </div>
        <div className="bg-gray-500/20 rounded-2xl p-3 px-4">
          <Switch size="sm" onValueChange={handleSwitch} isSelected={isSite}>
            Saytga kirishga ruxsat
          </Switch>
        </div> */}
      </div>

      {isSite && (
        <div className="mt-3 grid grid-cols-4 gap-3 transition-all duration-300 ease-linear">
          {data?.map((mod) => (
            <div className="bg-gray-500/20 rounded-xl p-4" key={mod.name}>
              <Checkbox
                checked={isModuleChecked(mod)}
                onChange={(checked) => handleModuleChange(mod, checked)}
              >
                {mod.name}
              </Checkbox>

              <div
                className={cn(
                  "flex flex-col gap-2 pl-4 mt-4",
                  !mod?.actions.length ? "hidden" : "",
                )}
              >
                {mod?.actions.map((act) => (
                  <Checkbox
                    key={act.code}
                    checked={isActionChecked(act.code)}
                    onChange={(checked) =>
                      handleActionChange(act.code, checked)
                    }
                  >
                    {act.name}
                  </Checkbox>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
