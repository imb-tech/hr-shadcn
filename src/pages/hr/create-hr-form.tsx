import FormInput from "@/components/form/input"
import { FormNumberInput } from "@/components/form/number-input"
import PhoneField from "@/components/form/phone-field"
import TimeInput from "@/components/form/time-input"
import { FILTER, HR_API, POSITION } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import PermissionField from "./permission-field"
import { toast } from "sonner"
import ImageInput from "@/components/form/image-input"
import { FormSelect } from "@/components/form/select"
import { educationLevels } from "@/lib/utils"
import WeekdaysFields from "@/components/form/weekdays-field"
import { Button } from "@/components/ui/button"
import { FormMultiCombobox } from "@/components/form/multi-combobox"
import { FormCombobox } from "@/components/form/combobox"

export default function CreateHrForm() {
    const form = useForm<Human>({
        defaultValues: {
            work_days: [1, 2, 3, 4, 5],
            actions: [],
        },
    })
    const { "hr-edit": id } = useParams({ strict: false })
    const queryClient = useQueryClient()
    const { data: dataPosition } = useGet<Position[]>(POSITION)
    const { data: companies } = useGet<Filter[]>(FILTER + "office")
    const { data, isSuccess } = useGet<Human>(`${HR_API}/${id}`, {
        options: { enabled: Boolean(id) },
    })

    const navigate = useNavigate()

    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }

    const { mutate: postMutate, isPending: createPending } = usePost(
        {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: [HR_API] })
                toast.success("Muaffaqiyatli qo'shildi")
                form.reset()
                navigate({ to: "/hr" })
            },
        },
        config,
    )

    const { mutate: updateMutate, isPending: updatePending } = usePatch(
        {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: [HR_API] })
                toast.success("Muaffaqiyatli yangilandi")
                form.reset()
                navigate({ to: "/hr" })
            },
        },
        config,
    )

    const onSubmit = (values: Human) => {
        const formData = new FormData()

        const profile = {
            phone_number: values?.profile.phone_number,
            phone_number2: values?.profile.phone_number2,
            id_number: values?.profile.id_number,
            address: values?.profile.address,
            residence: values?.profile.residence,
            education: values?.profile.education,
        }

        const user = {
            password: values.password !== "" ? values.password : undefined,
            username: values.username,
            first_name: values.first_name,
            last_name: values.last_name,
            middle_name: values.middle_name,
            salary: values.salary,
            work_shift_start: values.work_shift_start,
            work_shift_end: values.work_shift_end,
            work_days: values.work_days,
            role: values.role,
            companies: Array.isArray(values.companies) ? values.companies : [],
            fine_per_minute: values.fine_per_minute,
            hikvision_id: values.hikvision_id,
        }
        // if (values.face && typeof values.face !== "string") {
        //   formData.append("face", values.face);
        // }

        if (values?.face instanceof File) {
            formData.append("face", values.face)
        }

        if (values?.actions?.length) {
            formData.append("actions", JSON.stringify(values.actions))
        }

        formData.append("profile", JSON.stringify(profile))

        for (const [key, val] of Object.entries(user)) {
            if (
                val &&
                !["work_days", "companies", "face", "actions"].includes(key)
            ) {
                if (key === "phone_number" || key === "phone_number2") {
                    formData.append(key, (val as string).replace("+", ""))
                } else formData.append(key, val.toString())
            }
        }

        formData.append("work_days", `[${user.work_days.join(",")}]`)
        formData.append(
            "companies",
            `[${user.companies?.filter((c) => c != ",").join(",")}]`,
        )

        if (id) {
            updateMutate(`${HR_API}/${id}`, formData)
        } else {
            postMutate(HR_API, formData)
        }
    }

    const role = form.watch("role")

    useEffect(() => {
        const selectedRole = dataPosition?.find((el) => el.id === role)
        if (selectedRole) {
            form.setValue("salary", selectedRole?.salary)
            form.setValue("work_shift_start", selectedRole?.work_shift_start)
            form.setValue("work_shift_end", selectedRole?.work_shift_end)
            form.setValue("work_days", selectedRole?.work_days)
            form.setValue("fine_per_minute", selectedRole?.fine_per_minute - 0)
        }
    }, [role])

    useEffect(() => {
        if (data?.id) {
            form.reset({
                profile: data.profile,
                first_name: data.first_name,
                last_name: data.last_name,
                middle_name: data.middle_name,
                password: data.password ?? undefined,
                salary: data.salary,
                username: data.username,
                role: data.role.toString(),
                work_shift_start: data.work_shift_start,
                work_shift_end: data.work_shift_end,
                work_days: data.work_days,
                companies: data.companies,
                fine_per_minute: data.fine_per_minute,
                face: data.face ?? undefined,
                hikvision_id: data?.hikvision_id,
                actions: data?.actions,
            })
        }
    }, [isSuccess, data])

    return (
        <FormProvider {...form}>
            <form
                className="my-4 space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4 px-4 py-6 border dark:border-zinc-700 rounded-2xl">
                    <h1 className="font-bold text-xl md:col-span-2 col-span-1">
                        Shaxsiy ma'lumotlar
                    </h1>
                    <div className="md:col-span-2 grid lg:grid-cols-3 gap-4 grid-cols-1">
                        <div>
                            <ImageInput<Human>
                                name="face"
                                wrapperClassName="row-span-2 max-w-44"
                                areaClassName="h-44 w-44"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2 grid lg:grid-cols-3 gap-4 grid-cols-1">
                        <FormInput
                            required
                            label={"Familiya"}
                            methods={form}
                            name={"first_name"}
                            placeholder={"Familiya"}
                            type="text"
                        />
                        <FormInput
                            required
                            label={"Ism"}
                            methods={form}
                            name={"last_name"}
                            placeholder={"Ism"}
                            type="text"
                        />
                        <FormInput
                            label={"Otasining ismi"}
                            methods={form}
                            name={"middle_name"}
                            placeholder={"Otasining ismi"}
                            type="text"
                        />
                    </div>

                    <PhoneField
                        required
                        methods={form}
                        name={"profile.phone_number"}
                    />
                    <PhoneField
                        label="Qo'shimcha raqam"
                        methods={form}
                        name={"profile.phone_number2"}
                    />
                    <FormInput
                        label={"Doimiy turar joyi"}
                        methods={form}
                        name={"profile.address"}
                        placeholder={"Toshkent shahar, Chilonzor tumani"}
                        type="text"
                    />
                    <FormInput
                        label={"Vaqtinchalik turar joyi"}
                        methods={form}
                        name={"profile.residence"}
                        placeholder={"Toshkent shahar, Chilonzor tumani"}
                        type="text"
                    />
                    <FormInput
                        label={"Pasport ma'lumoti"}
                        maxLength={9}
                        methods={form}
                        name={"profile.id_number"}
                        placeholder={"AB 000 00 00 "}
                        type="text"
                    />
                    <FormSelect
                        label="O'quv ma'lumoti"
                        control={form.control}
                        name="profile.education"
                        options={educationLevels}
                        valueKey="key"
                    />
                </div>

                <div className="grid md:grid-cols-2 grid-cols-1 gap-4 px-4 py-6 border dark:border-zinc-700 rounded-2xl">
                    <h1 className="font-bold text-xl md:col-span-2">
                        Ishga oid ma'lumotlar
                    </h1>
                    <FormMultiCombobox
                        control={form.control}
                        name="companies"
                        options={companies}
                        labelKey="name"
                        valueKey="id"
                        label="Ofis"
                    />
                    <FormCombobox
                        required
                        control={form.control}
                        name="role"
                        options={dataPosition}
                        labelKey="name"
                        valueKey="id"
                        label="Lavozimi"
                    />

                    <WeekdaysFields<Human>
                        required
                        itemClassName="py-[3px] w-10 rounded-xl sm:py-[9px] sm:w-16"
                        label="Ish kunlari"
                        name="work_days"
                        wrapperClassName="gap-1"
                    />

                    <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                        <TimeInput
                            label={"Ish boshlanish vaqti"}
                            methods={form}
                            name="work_shift_start"
                        />
                        <TimeInput
                            label={"Ish tugash vaqti"}
                            methods={form}
                            name="work_shift_end"
                        />
                    </div>

                    <FormNumberInput
                        required
                        control={form.control}
                        label="Oylik maosh"
                        name="salary"
                        placeholder="Ex: 123000"
                        size={"lg" as any}
                        thousandSeparator=" "
                    />

                    <FormNumberInput
                        control={form.control}
                        label="Jarima (1 daqiqa uchun)"
                        name="fine_per_minute"
                        placeholder="Ex: 300"
                        size={"lg" as any}
                        thousandSeparator=" "
                    />

                    <FormInput
                        label={"Login"}
                        methods={form}
                        name={"username"}
                        placeholder={"Login"}
                        wrapperClassName="pt-1"
                    />
                    <FormInput
                        label={"Parol"}
                        methods={form}
                        name={"password"}
                        placeholder={"*******"}
                    />

                    <FormInput
                        methods={form}
                        label="Hikvision ID"
                        name="hikvision_id"
                        placeholder="Ex: 991"
                        size={"lg" as any}
                    />
                </div>

                {(isSuccess || !id) && (
                    <div className="px-4 py-6 border dark:border-zinc-700 rounded-2xl">
                        <PermissionField
                            defaultIsSite={(data?.actions?.length ?? 0) > 0}
                        />
                    </div>
                )}

                <div className="w-full flex justify-end items-center gap-3">
                    <Button
                        variant={"destructive"}
                        disabled={createPending || updatePending}
                        type="button"
                        onClick={() => navigate({ to: "/hr" })}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        color="primary"
                        loading={createPending || updatePending}
                        disabled={createPending || updatePending}
                        type="submit"
                    >
                        Saqlash
                    </Button>
                </div>
            </form>
        </FormProvider>
    )
}
