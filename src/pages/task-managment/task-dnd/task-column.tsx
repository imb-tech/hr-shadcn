import { Draggable, Droppable } from "react-beautiful-dnd"
import { Trash } from "lucide-react"
import TaskList from "./task-list"
import AddTaskButton from "./add-task-button"
import { useModal } from "@/hooks/useModal"
import { useState } from "react"
import { PROJECTS_TASKS, STATUSES } from "@/constants/api-endpoints"
import { useForm } from "react-hook-form"
import { usePatch } from "@/hooks/usePatch"
import FormInput from "@/components/form/input"
import { useQueryClient } from "@tanstack/react-query"
import { useParams, useSearch } from "@tanstack/react-router"

type Props = {
    column: Column
    index: number
    handleAdd: (id: number) => void
    onDelete: (id: number) => void
}

interface FormValue {
    name: string
}

const TaskColumn = ({ column, index, handleAdd, onDelete }: Props) => {
    const [state, setState] = useState<"input" | "text">("text")
    const { openModal: openModalDelete } = useModal("project-delete")
    const queryClient = useQueryClient()
    const params = useParams({ from: "/_main/project/$id" });
    const search = useSearch({ from: "/_main/project/$id" })
    const form = useForm<FormValue>()

    const handleDeleteItem = (id: number) => {
        openModalDelete()
        onDelete(id)
    }

    const { mutate: mutateCreate } = usePatch({
        onSuccess: () => {
            const cacheKey = [`${PROJECTS_TASKS}/${params?.id}`,...Object.values(search)]
            const cacheData = queryClient.getQueryData<Column[]>(cacheKey)
            const newName = form.getValues("name")

            const updatedData = cacheData?.map((item) =>
                item.id === column.id ? { ...item, name: newName } : item,
            )
            setState("text")
            form.reset()
            queryClient.setQueryData(cacheKey, updatedData)
        },
    })

    const handleBlur = () => {
        const value = form.getValues("name")
        if (value && value !== column.name) {
            onSubmit({ name: value })
        } else {
            setState("text")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleBlur()
        }
    }

    const onSubmit = (value: FormValue) => {
        mutateCreate(`${STATUSES}/${column?.id}`, value)
    }

    return (
        <Draggable draggableId={column.id.toString()} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="rounded-md"
                >
                    <div {...provided.dragHandleProps}>
                        <Droppable
                            droppableId={column.id.toString()}
                            type="card"
                        >
                            {(dropProvided) => (
                                <div
                                    ref={dropProvided.innerRef}
                                    {...dropProvided.droppableProps}
                                    className="dark:bg-[#0c0d03] bg-zinc-200 p-2 rounded-lg min-w-64 max-w-64"
                                >
                                    <div className="mb-2 w-full flex justify-between items-center gap-2">
                                        {state === "text" ? (
                                            <h1
                                                className="p-1 cursor-pointer line-clamp-1 break-all w-full 2xl:text-sm text-[14px] "
                                                onClick={() => {
                                                    setState("input")
                                                    form.setValue(
                                                        "name",
                                                        column.name,
                                                    )
                                                }}
                                            >
                                                {`${column.name}${column.count > 0 ? ` (${column.count})` : ''}`}
                                            </h1>
                                        ) : (
                                            <form
                                                className="w-full"
                                                onSubmit={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                <FormInput
                                                    className="h-8 placeholder:text-[13px] 2xl:placeholder:text-sm"
                                                    wrapperClassName={"h-8"}
                                                    methods={form}
                                                    name="name"
                                                    placeholder="Ro'yxat nomini kiriting"
                                                    onBlur={handleBlur}
                                                    onKeyDown={handleKeyDown}
                                                    autoFocus
                                                />
                                            </form>
                                        )}
                                        {column.has_delete && (
                                            <button
                                                onClick={() => {
                                                    handleDeleteItem(
                                                        Number(column.id),
                                                    )
                                                }}
                                                className="p-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-500"
                                            >
                                                <Trash size={14} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="no-scrollbar-y max-h-[68vh] 2xl:max-h-[80vh] overflow-y-auto">
                                        <TaskList
                                            tasks={column.tasks}
                                            onDelete={onDelete}
                                        />
                                        {dropProvided.placeholder}
                                    </div>
                                    <AddTaskButton
                                        onClick={() =>
                                            handleAdd(Number(column.id))
                                        }
                                    />
                                </div>
                            )}
                        </Droppable>
                    </div>
                </div>
            )}
        </Draggable>
    )
}

export default TaskColumn
