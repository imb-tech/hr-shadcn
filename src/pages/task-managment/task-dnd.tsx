import { Plus } from "lucide-react"
import React, { useState } from "react"
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "react-beautiful-dnd"
import TaskCard from "./task-card"
import { useModal } from "@/hooks/useModal"
import { Button } from "@/components/ui/button"
import { dataTask } from "@/lib/utils"
import { useTaskStore } from "@/store/task-management"


const TaskDnd: React.FC = () => {
    const [columns, setColumns] = useState<Column[]>(dataTask)
    const { clearTask } = useTaskStore()
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

        const sourceItems = [...columns[sourceColIndex].items]
        const destItems = [...columns[destColIndex].items]
        const [movedItem] = sourceItems.splice(source.index, 1)

        if (source.droppableId === destination.droppableId) {
            sourceItems.splice(destination.index, 0, movedItem)
            const newColumns = [...columns]
            newColumns[sourceColIndex].items = sourceItems
            setColumns(newColumns)
        } else {
            destItems.splice(destination.index, 0, movedItem)
            const newColumns = [...columns]
            newColumns[sourceColIndex].items = sourceItems
            newColumns[destColIndex].items = destItems
            setColumns(newColumns)
        }
    }

    const handleAdd = ()=>{
      clearTask()
      openModal()
    }

    return (
        <div className="py-3">
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
                                            className="bg-background px-1  rounded-md"
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
                                                        className="bg-zinc-800 p-2 rounded-lg  min-w-72"
                                                    >
                                                        <h1 className=" p-2">
                                                            {column.name}
                                                        </h1>
                                                        <div className="no-scrollbar-x overflow-y-auto h-full max-h-[70vh]">
                                                            {column.items.map(
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
