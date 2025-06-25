import { Plus, Trash } from "lucide-react"
import React, { useEffect, useState } from "react"
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "react-beautiful-dnd"
import TaskCard from "./task-card"
import { useModal } from "@/hooks/useModal"
import { Button } from "@/components/ui/button"
import { useGet } from "@/hooks/useGet"
import { PROJECTS_TASKS } from "@/constants/api-endpoints"
import { useParams } from "@tanstack/react-router"

const TaskDnd: React.FC = () => {
    const params = useParams({ from: "/_main/project/$id" })
    const { data, isSuccess } = useGet(`${PROJECTS_TASKS}/${params?.id}`, {
        options: { enabled: !!params?.id },
    })
    const [columns, setColumns] = useState<Column[]>([])
    const { openModal } = useModal("task-modal")

    const onDragEnd = (result: DropResult) => {
        const { source, destination, type } = result
        if (!destination) return

        // COLUMN DRAG
        if (type === "column") {
            const newColumns = [...columns]
            const [moved] = newColumns.splice(source.index, 1)
            newColumns.splice(destination.index, 0, moved)
            setColumns(newColumns)
            return
        }

        // CARD DRAG
        const sourceColIndex = columns.findIndex(
            (col) => col.id === source.droppableId,
        )
        const destColIndex = columns.findIndex(
            (col) => col.id === destination.droppableId,
        )

        const sourceItems = [...columns[sourceColIndex].tasks]
        const destItems = [...columns[destColIndex].tasks]
        const [movedItem] = sourceItems.splice(source.index, 1)

        if (source.droppableId === destination.droppableId) {
            sourceItems.splice(destination.index, 0, movedItem)
            const newColumns = [...columns]
            newColumns[sourceColIndex].tasks = sourceItems
            setColumns(newColumns)
        } else {
            destItems.splice(destination.index, 0, movedItem)
            const newColumns = [...columns]
            newColumns[sourceColIndex].tasks = sourceItems
            newColumns[destColIndex].tasks = destItems
            setColumns(newColumns)
        }
    }

    const handleAdd = () => {
        openModal()
    }

    useEffect(() => {
        if (isSuccess) {
            setColumns(data)
        }
    }, [params, data, isSuccess])

    return (
        <div className="py-3  h-full">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                    droppableId="all-columns"
                    direction="horizontal"
                    type="column"
                >
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="flex gap-2 items-start "
                        >
                            {columns.map((column, colIndex) => (
                                <Draggable
                                    key={column.id}
                                    draggableId={column.id}
                                    index={colIndex}
                                >
                                    {(provided) => (
                                        <div
                                            {...provided.draggableProps}
                                            ref={provided.innerRef}
                                            className="rounded-md"
                                        >
                                            <Droppable
                                                droppableId={column.id}
                                                type="card"
                                            >
                                                {(provided) => (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        style={{
                                                            minHeight: 50,
                                                        }}
                                                        className="dark:bg-zinc-800 bg-zinc-200   p-2 rounded-lg  min-w-80 max-w-80"
                                                    >
                                                        <div className="w-full flex items-center justify-between">
                                                            <h1 className=" p-2">
                                                                {`${column.name} (${column?.count})`}
                                                            </h1>
                                                            <button className="p-2 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-500">
                                                                <Trash
                                                                    size={16}
                                                                />
                                                            </button>
                                                        </div>
                                                        <div className="no-scrollbar-x max-h-[68vh] 2xl:max-h-[80vh] h-full overflow-y-auto  transition-[height]">
                                                            {column?.tasks?.map(
                                                                (
                                                                    item,
                                                                    index,
                                                                ) => (
                                                                    <Draggable
                                                                        key={
                                                                            item.id
                                                                        }
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
                                                            onClick={handleAdd}
                                                            className="w-full"
                                                        >
                                                            <Plus size={16} />
                                                            Yangi qo'shish
                                                        </Button>
                                                    </div>
                                                )}
                                            </Droppable>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}

export default TaskDnd
