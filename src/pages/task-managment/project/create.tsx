import FormImagePicker from "@/components/form/img-picker"
import FormInput from "@/components/form/input"
import { Button } from "@/components/ui/button"
import { TASKLY_PROJECT } from "@/constants/api-endpoints"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useQueryClient } from "@tanstack/react-query"
import { Image } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type Props = {
    item?: FormValues | undefined
}

function ProjectCreate({ item }: Props) {
    const queryClient = useQueryClient()
    const { closeModal } = useModal("project-create")
    const form = useForm<FormValues>()

    const { mutate: mutateCreate, isPending: isPendingCreate } = usePost(
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [TASKLY_PROJECT] })
                toast.success("Muaffaqiyatli qo'shildi")
                closeModal()
                form.reset()
            },
        },
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    )
    const { mutate: mutateUpdate, isPending: isPendingUpdate } = usePatch(
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [TASKLY_PROJECT] })
                toast.success("Muaffaqiyatli yangilandi")
                closeModal()
                form.reset()
            },
        },
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    )

    const onSubmit = (values: FormValues) => {
        if (item?.id) {
            mutateUpdate(`${TASKLY_PROJECT}/${item.id}`, values)
        } else {
            mutateCreate(TASKLY_PROJECT, values)
        }
    }

    useEffect(() => {
        if (item?.id) {
            form.reset({
                name: item.name,
                background: item.background,
            })
        }
    }, [form, item])

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
                methods={form}
                name="name"
                label="Loyiha nomi"
                required
            />
            <FormImagePicker
                methods={form}
                name="background"
                label={<div className="flex items-center gap-2 justify-center"><Image size={20}/> <span>Orqa fon rasmi</span></div>}
            />
            <Button
                disabled={isPendingCreate || isPendingUpdate}
                loading={isPendingCreate || isPendingUpdate}
                className="float-end sm:w-max w-full"
            >
                Saqlash
            </Button>
        </form>
    )
}

export default ProjectCreate
