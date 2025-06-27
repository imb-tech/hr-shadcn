import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd"
import DeleteModal from "@/components/custom/delete-modal"
import TaskColumn from "./task-column"
import TodoListCreate from "./todo-list-create"
import { TASKS } from "@/constants/api-endpoints"

type Props = {
    currentId: number | undefined
    onDelete: (id: number) => void
    handleAdd: (id: number) => void
    data: Column[]
    isSuccess: boolean
    onDragEnd: (result: DropResult) => void
    params: {id:string}
}

const TaskDnd = ({
    currentId,
    data,
    handleAdd,
    isSuccess,
    onDelete,
    onDragEnd,
    params,
}: Props) => {
    return (
        <div className="py-3 flex items-start gap-3 w-full">
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
                                data?.map((col, index) => (
                                    <TaskColumn
                                        key={col.id}
                                        column={col}
                                        index={index}
                                        handleAdd={handleAdd}
                                        onDelete={onDelete}
                                    />
                                ))}
                                {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <TodoListCreate />
            <DeleteModal
                refetchKeys={[`/projects/tasks/${params?.id}`]}
                modalKey="task-delete"
                id={currentId}
                path={TASKS}
            />
        </div>
    )
}

export default TaskDnd
