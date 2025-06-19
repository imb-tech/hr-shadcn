import FormInput from "@/components/form/input"
import { Button } from "@/components/ui/button"
import { COMPANIES } from "@/constants/api-endpoints"
import useCheckPermission from "@/hooks/use-check-permission"
import { useGet } from "@/hooks/useGet"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import DrawPolygonMap from "../map/test-map/draw-polygon-map"

export default function CreateOfficeForm() {
    const queryClient = useQueryClient()
    const { id } = useParams({ from: "__root__" })
    const navigate = useNavigate()

    const { checkAllow } = useCheckPermission()

    const { data: store } = useGet<Office>(`${COMPANIES}/${id}`, {
        options: { enabled: Boolean(id) },
    })

    const { mutate: mutatePost, isPending } = usePost({
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: [COMPANIES],
            }),
                toast.success("Muvaffaqiyatli yaratildi")
            form.reset()
            navigate({ to: "/" })
        },
    })

    const { mutate: mutatePatch, isPending: isEditing } = usePatch({
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: [COMPANIES],
            }),
                toast.success("Muvaffaqiyatli yangilandi")
            form.reset()
            navigate({ to: "/" })
        },
    })

    const form = useForm<Properties>({
        defaultValues:
            store?.properties ?
                {
                    ...store.properties,
                    users: "1",
                    locations: [],
                }
            :   undefined,
    })

    const onSubmit = (data: Properties) => {
        if (!checkAllow("office_control")) {
            toast.warning("Sizda o'zgartirish uchun huquq yo'q")

            return
        }
        if (!data?.polygon && data.polygon?.coordinates?.length < 1) {
            form.setError("polygon", { type: "required" })

            return
        }

        const values = {
            ...data,
            location: {
                type: "Point",
                coordinates: [41.20066, 69.236537],
            },
        }

        if (store?.id) {
            mutatePatch(`${COMPANIES}/${store.id}`, values)
        } else {
            mutatePost(COMPANIES, values)
        }
    }

    useEffect(() => {
        form.reset(store?.properties)
    }, [store])

    return (
        <FormProvider {...form}>
            <form
                className="flex flex-col gap-2 mt-5"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormInput
                    required
                    label="Ofis nomi"
                    methods={form}
                    name="name"
                />

                <FormInput
                    required
                    label="Manzil"
                    methods={form}
                    name="address"
                />

                <div className="grid grid-cols-2 gap-3 py-2">
                    <FormInput
                        required
                        type="time"
                        label={"Tushlik boshlanish vaqti"}
                        methods={form}
                        name="lunch_start_time"
                    />
                    <FormInput
                        required
                        type="time"
                        label={"Tushlik tugash vaqti"}
                        methods={form}
                        name="lunch_end_time"
                    />
                </div>

                <DrawPolygonMap
                    defaultValues={store}
                    defaultZoom={16}
                    name="polygon"
                />

                {/* <OfficeLocationSelect
        required
        error={!!form.formState.errors["polygon"]}
        handleMapChange={(pnts) => {
          form.clearErrors("polygon");
          form.setValue("polygon", pnts);
        }}
        initialValue={store?.properties.polygon.coordinates || []}
      /> */}

                <div className="flex justify-end mt-3">
                    <Button
                        color="primary"
                        loading={isPending || isEditing}
                        disabled={isPending || isEditing}
                        type="submit"
                    >
                        Saqlash
                    </Button>
                </div>
            </form>
        </FormProvider>
    )
}
