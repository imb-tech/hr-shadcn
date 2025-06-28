import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd"
import DeleteModal from "@/components/custom/delete-modal"
import TaskColumn from "./task-column"
import TodoListCreate from "./todo-list-create"
import { PROJECTS_TASKS, TASKS } from "@/constants/api-endpoints"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type Props = {
    currentId: number | undefined
    onDelete: (id: number) => void
    handleAdd: (id: number) => void
    data: Column[]
    isSuccess: boolean
    onDragEnd: (result: DropResult) => void
    params: { id: string }
    isLoading: boolean
}

const TaskDnd = ({
    currentId,
    data,
    handleAdd,
    isSuccess,
    onDelete,
    onDragEnd,
    params,
    isLoading,
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
                            {isLoading &&
                                Array.from({ length: 4 }).map((_, index) => (
                                    <Card className="w-64" key={index}>
                                        <CardContent className="space-y-3">
                                            {Array.from({ length: 3 }).map(
                                                (_, idx) => (
                                                    <Skeleton
                                                        key={idx}
                                                        className="h-40"
                                                    />
                                                ),
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <TodoListCreate />
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
