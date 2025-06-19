import FormInput from "@/components/form/input"
import ModalFormActions from "@/components/form/modal-from-actions"
import { FormNumberInput } from "@/components/form/number-input"
import FormTimeInput from "@/components/form/time-input"
import WeekdaysFields from "@/components/form/weekdays-field"
import { POSITION } from "@/constants/api-endpoints"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

interface CreatePositionsFormProps {
    dataItem?: Position
}

export default function CreatePositionsForm({
    dataItem,
}: CreatePositionsFormProps) {
    const form = useForm<Position>({
        defaultValues: { work_days: [1, 2, 3, 4, 5], salary: 0 },
    })
    const queryClient = useQueryClient()
    const { closeModal } = useModal()

    const { mutate: postMutate, isPending: isPendingCreate } = usePost({
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: [POSITION] })
            toast.success("Muaffaqiyatli qo'shildi")
            closeModal()
            form.reset()
        },
    })

    const { mutate: updateMutate, isPending: isPendingUpdate } = usePatch({
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: [POSITION] })
            toast.success("Muaffaqiyatli yangilandi")
            closeModal()
            form.reset()
        },
    })

    const onSubmit = (values: Position) => {
        const nd = {
            ...values,
        }

        if (dataItem?.id) {
            updateMutate(`${POSITION}/${dataItem.id}`, nd)
        } else {
            postMutate(POSITION, nd)
        }
    }

    useEffect(() => {
        if (dataItem) {
            form.reset(dataItem)
        }
    }, [dataItem, form])

    return (
        <FormProvider {...form}>
            <form
                className="flex flex-col gap-2"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormInput
                    required
                    label="Lavozim"
                    methods={form}
                    name="name"
                />

                <WeekdaysFields<Position>
                    required
                    label="Ish kunlari"
                    name="work_days"
                />

                <div className="grid md:grid-cols-2 grid-cols-1 gap-3 py-2">
                    <FormTimeInput
                        required
                        label={"Ish boshlanish vaqti"}
                        methods={form}
                        name="work_shift_start"
                    />
                    <FormTimeInput
                        required
                        label={"Ish tugash vaqti"}
                        methods={form}
                        name="work_shift_end"
                    />
                </div>

                <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                    <FormNumberInput
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
                        placeholder="Ex: 250"
                        size={"lg" as any}
                        thousandSeparator=" "
                    />
                </div>

                <ModalFormActions
                    isLoading={isPendingCreate || isPendingUpdate}
                />
            </form>
        </FormProvider>
    )
}
