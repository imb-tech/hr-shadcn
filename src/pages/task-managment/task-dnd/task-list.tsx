import { Draggable } from "react-beautiful-dnd"
import TaskCard from "./task-card"

type Props = {
    tasks: any[]
    onDelete: (id: number) => void
}

const TaskList = ({ tasks, onDelete }: Props) => {
    return tasks?.map((item, index) => (
        <Draggable
            key={item.id.toString()}
            draggableId={item.id.toString()}
            index={index}
        >
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        marginBottom: 8,
                        ...provided.draggableProps.style,
                    }}
                >
                    <TaskCard
                        item={item}
                        onDelete={() => onDelete(item.id)}
                    />
                </div>
            )}
        </Draggable>
    ))
}

export default TaskList
