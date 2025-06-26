import { Plus, Trash } from "lucide-react"
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "react-beautiful-dnd"
import { useEffect, useState } from "react"
import TaskCard from "./task-card"
import { useModal } from "@/hooks/useModal"
import { Button } from "@/components/ui/button"
import { useGet } from "@/hooks/useGet"
import {
    PROJECTS_TASKS,
    TASKS,
    STATUSES,
    STATUSES_MOVE,
} from "@/constants/api-endpoints"
import { useParams } from "@tanstack/react-router"
import DeleteModal from "@/components/custom/delete-modal"
import { usePatch } from "@/hooks/usePatch"
import { useQueryClient } from "@tanstack/react-query"
import { usePost } from "@/hooks/usePost"

type Props = {
    onClickItem?: (val: number) => void
    onDelete: (id: number) => void
}

const TaskDnd = ({ onClickItem, onDelete }: Props) => {
    const params = useParams({ from: "/_main/project/$id" })
    const { data, isSuccess } = useGet<Column[]>(
        `${PROJECTS_TASKS}/${params?.id}`,
        { options: { enabled: !!params?.id } },
    )

    const [currentId, setCurrentId] = useState<number>()
    const { openModal: openModalCreate } = useModal("task-modal")
    const { openModal: openModalDelete } = useModal("project-delete")
    const queryClient = useQueryClient()

    const { mutate: mutateCard } = usePatch({
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: [`${PROJECTS_TASKS}/${params?.id}`],
            }),
    })

    const { mutate: mutateColumn } = usePost({
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: [`${PROJECTS_TASKS}/${params?.id}`],
            }),
    })

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId, type } = result

        if (!destination) return

        const cacheKey = [`${PROJECTS_TASKS}/${params?.id}`]
        const prevColumns = queryClient.getQueryData<Column[]>(cacheKey)

        if (!prevColumns) return

        if (type === "column") {
            const newColumns = [...prevColumns]
            const [removed] = newColumns.splice(source.index, 1)
            newColumns.splice(destination.index, 0, removed)

            queryClient.setQueryData(cacheKey, newColumns)

            const from_status = prevColumns[source.index]?.id
            const to_status = prevColumns[destination.index]?.id

            if (from_status && to_status && from_status !== to_status) {
                mutateColumn(`${STATUSES_MOVE}`, {
                    from_status,
                    to_status,
                })
            }

            return
        }

        if (source.droppableId !== destination.droppableId) {
            const newColumns = [...prevColumns]

            const fromIndex = newColumns.findIndex(
                (col) => col.id.toString() === source.droppableId,
            )
            const toIndex = newColumns.findIndex(
                (col) => col.id.toString() === destination.droppableId,
            )

            if (fromIndex === -1 || toIndex === -1) return

            const fromTasks = newColumns[fromIndex].tasks || []
            const toTasks = newColumns[toIndex].tasks || []

            const taskIdx = fromTasks.findIndex(
                (t) => t.id.toString() === draggableId,
            )
            if (taskIdx === -1) return

            const [movingTask] = fromTasks.splice(taskIdx, 1)
            toTasks.unshift(movingTask)

            newColumns[fromIndex].tasks = fromTasks
            newColumns[toIndex].tasks = toTasks

            queryClient.setQueryData(cacheKey, newColumns)

            mutateCard(`${TASKS}/${draggableId}`, {
                status: destination.droppableId,
            })
        }
    }

    const handleAdd = (id: number) => {
        onClickItem?.(id)
        openModalCreate()
    }

    return (
        <div className="py-3 h-full">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                    droppableId="all-columns"
                    direction="horizontal"
                    type="column"
                >
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex gap-2 !items-start"
                        >
                            {isSuccess &&
                                data?.map((column, colIndex) => (
                                    <Draggable
                                        key={column.id.toString()}
                                        draggableId={column.id.toString()}
                                        index={colIndex}
                                    >
                                        {(provided) => (
                                            <div
                                                {...provided.draggableProps}
                                                ref={provided.innerRef}
                                                className="rounded-md"
                                            >
                                                <div
                                                    {...provided.dragHandleProps}
                                                >
                                                    <Droppable
                                                        droppableId={column.id.toString()}
                                                        type="card"
                                                    >
                                                        {(provided) => (
                                                            <div
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                {...provided.droppableProps}
                                                                className="dark:bg-zinc-800 bg-zinc-200 p-2 rounded-lg min-w-80 max-w-80"
                                                            >
                                                                <div className="w-full flex items-center justify-between">
                                                                    <h1 className="p-2">
                                                                        {`${column.name} (${column.count})`}
                                                                    </h1>
                                                                    {column.name !==
                                                                        "Finished" && (
                                                                        <button
                                                                            onClick={() => {
                                                                                onDelete(
                                                                                    Number(
                                                                                        column.id,
                                                                                    ),
                                                                                )
                                                                                openModalDelete()
                                                                            }}
                                                                            className="p-2 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-500"
                                                                        >
                                                                            <Trash
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <div className="no-scrollbar-x max-h-[68vh] 2xl:max-h-[80vh] overflow-y-auto">
                                                                    {column.tasks?.map(
                                                                        (
                                                                            item,
                                                                            index,
                                                                        ) => (
                                                                            <Draggable
                                                                                key={item.id.toString()}
                                                                                draggableId={item.id.toString()}
                                                                                index={
                                                                                    index
                                                                                }
                                                                            >
                                                                                {(
                                                                                    provided,
                                                                                ) => (
                                                                                    <div
                                                                                        ref={
                                                                                            provided.innerRef
                                                                                        }
                                                                                        {...provided.draggableProps}
                                                                                        {...provided.dragHandleProps}
                                                                                        style={{
                                                                                            marginBottom: 8,
                                                                                            ...provided
                                                                                                .draggableProps
                                                                                                .style,
                                                                                        }}
                                                                                    >
                                                                                        <TaskCard
                                                                                            onDelete={(
                                                                                                id,
                                                                                            ) =>
                                                                                                setCurrentId(
                                                                                                    id,
                                                                                                )
                                                                                            }
                                                                                            item={
                                                                                                item
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            </Draggable>
                                                                        ),
                                                                    )}
                                                                    {
                                                                        provided.placeholder
                                                                    }
                                                                </div>
                                                                <Button
                                                                    onClick={() =>
                                                                        handleAdd(
                                                                            Number(
                                                                                column.id,
                                                                            ),
                                                                        )
                                                                    }
                                                                    className="w-full mt-2"
                                                                >
                                                                    <Plus
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                    Yangi
                                                                    qo‘shish
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </Droppable>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <DeleteModal
                refetchKeys={[`${PROJECTS_TASKS}/${params?.id}`]}
                modalKey="task-delete"
                id={currentId}
                path={TASKS}
            />
        </div>
    )
}

export default TaskDnd
