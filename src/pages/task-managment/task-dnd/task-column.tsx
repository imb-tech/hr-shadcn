import { Draggable, Droppable } from "react-beautiful-dnd"
import { Trash } from "lucide-react"
import TaskList from "./task-list"
import AddTaskButton from "./add-task-button"
import { useModal } from "@/hooks/useModal"

type Props = {
    column: Column
    index: number
    handleAdd: (id: number) => void
    onDelete: (id: number) => void
}

const TaskColumn = ({ column, index, handleAdd, onDelete }: Props) => {
    const { openModal: openModalDelete } = useModal("project-delete")

    const handleDeleteItem = (id: number) => {
        openModalDelete()
        onDelete(id)
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
                                    <div className=" w-full flex justify-between items-center">
                                        <h1 className="p-2">
                                            {`${column.name} (${column.count})`}
                                        </h1>
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
