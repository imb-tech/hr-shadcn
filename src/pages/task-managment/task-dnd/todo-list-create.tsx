import FormInput from "@/components/form/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PROJECTS_TASKS, STATUSES } from "@/constants/api-endpoints"
import { usePost } from "@/hooks/usePost"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

type Props = {}

interface FormValue {
    name: string
}
 
function TodoListCreate({}: Props) {
    const [state, setState] = useState<"button" | "create">("button")
    const queryClient = useQueryClient()
    const params = useParams({ from: "/_main/project/$id" })
    const { mutate: mutateCreate, isPending: isPendingCreate } = usePost({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [`${PROJECTS_TASKS}/${params?.id}`],
            })
            setState("button")
            form.reset()
        },
    })
    const form = useForm<FormValue>()

    const onSubmit = (value: FormValue) => {
        mutateCreate(STATUSES, {
            ...value,
            project: params?.id,
        })
    }
    return (
        <Card className="min-w-64 max-w-64 dark:bg-background bg-zinc-200  cursor-pointer">
            <CardContent className="h-full p-3  flex gap-2 items-center justify-center">
                {state === "button" ? (
                    <Button
                        type="button"
                        onClick={() => setState("create")}
                        size={"sm"}
                        className="text-xs justify-start 2xl:text-sm flex gap-2 items-center w-full"
                    >
                        <Plus size={18} />
                        <span className="font-medium">
                            {" "}
                            Boshqa ro'yxat qo'shing
                        </span>
                    </Button>
                ) : (
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-2"
                    >
                        <FormInput
                            className="h-8 placeholder:text-[13px] 2xl:placeholder:text-sm"
                            wrapperClassName={"h-8"}
                            methods={form}
                            name="name"
                            placeholder="Ro'yxat nomini kiriting"
                        />
                        <div className="flex items-center justify-end gap-2 w-full">
                            <Button
                                type="button"
                                variant={"destructive"}
                                onClick={() => setState("button")}
                                size={"sm"}
                                className="text-xs  2xl:text-sm "
                            >
                                Yopish
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPendingCreate}
                                loading={isPendingCreate}
                                onClick={() => setState("create")}
                                size={"sm"}
                                className="text-xs  2xl:text-sm  "
                            >
                                Qo'shish
                            </Button>
                        </div>
                    </form>
                )}
            </CardContent>
        </Card>
    )
}

export default TodoListCreate
