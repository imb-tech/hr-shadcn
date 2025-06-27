import { useParams } from "@tanstack/react-router"
import { useGet } from "@/hooks/useGet"
import { usePost } from "@/hooks/usePost"
import { useQueryClient } from "@tanstack/react-query"
import { useModal } from "@/hooks/useModal"
import { MOVE_TASK, PROJECTS_TASKS, STATUSES_MOVE } from "@/constants/api-endpoints"
import { useState } from "react"
import { DropResult } from "react-beautiful-dnd"

export const useTaskDndHandlers = () => {
    const params = useParams({ from: "/_main/project/$id" })
    const [currentId, setCurrentId] = useState<number>()
    const { openModal: openModalCreate } = useModal("task-modal")
    const queryClient = useQueryClient()

    const { data, isSuccess } = useGet<Column[]>(`${PROJECTS_TASKS}/${params?.id}`, {
        options: { enabled: !!params?.id },
    })

    const { mutate: mutateCard } = usePost()

    const { mutate: mutateColumn } = usePost()

    const handleAdd = (id: number) => {
        openModalCreate();
        setCurrentId(id)
    }

    const onDelete = (id: number) => {
        setCurrentId(id)
    }

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId, type } = result
        if (!destination) return

        const cacheKey = [`${PROJECTS_TASKS}/${params?.id}`]
        const prevColumns = queryClient.getQueryData<Column[]>(cacheKey)
        if (!prevColumns) return

        if (type === "column") {
            const newColumns = [...prevColumns]

            const [removed] = newColumns.splice(source.index, 1)
            newColumns.splice(destination.index, 0, removed);
            queryClient.setQueryData(cacheKey, newColumns)

            if (source.index !== destination.index) {
                const items = newColumns.reduce((acc, item, index) => {
                    acc[item.id] = index + 1
                    return acc
                }, {} as Record<string, number>)

                mutateColumn(STATUSES_MOVE, { items, project: params?.id })
            }
            return
        }


        if (source.droppableId !== destination.droppableId) {

            const newColumns = [...prevColumns]
            const fromIndex = newColumns.findIndex((col) => col.id.toString() === source.droppableId)
            const toIndex = newColumns.findIndex((col) => col.id.toString() === destination.droppableId)
            if (fromIndex === -1 || toIndex === -1) return

            const fromTasks = [...newColumns[fromIndex].tasks]
            const toTasks = [...newColumns[toIndex].tasks]

            const taskIdx = fromTasks.findIndex((t: any) => t.id.toString() === draggableId)
            if (taskIdx === -1) return

            const [movingTask] = fromTasks.splice(taskIdx, 1)

            toTasks.splice(destination.index, 0, movingTask)

            newColumns[fromIndex] = {
                ...newColumns[fromIndex],
                tasks: fromTasks,
                count: fromTasks.length,
            }

            newColumns[toIndex] = {
                ...newColumns[toIndex],
                tasks: toTasks,
                count: toTasks.length,
            }
            const filterTasks = newColumns?.find(col => col.id.toString() === destination.droppableId)?.tasks || [];
            const items = filterTasks.reduce((acc, item, index) => {
                acc[item.id] = index + 1
                return acc
            }, {} as Record<number, number>)

            queryClient.setQueryData(cacheKey, newColumns)

            mutateCard(MOVE_TASK, {
                status: destination.droppableId,
                items
            })
        } else {

            const newColumns = [...prevColumns]
            const colIndex = newColumns.findIndex((col) => col.id.toString() === source.droppableId)
            if (colIndex === -1) return

            const tasks = [...newColumns[colIndex].tasks]
            const taskIdx = tasks.findIndex((t: any) => t.id.toString() === draggableId)
            if (taskIdx === -1) return

            const [movingTask] = tasks.splice(taskIdx, 1)
            tasks.splice(destination.index, 0, movingTask)

            newColumns[colIndex] = {
                ...newColumns[colIndex],
                tasks,
                count: tasks.length,
            }
            const filterTasks = newColumns?.find(col => col.id.toString() === destination.droppableId)?.tasks || [];
            const items = filterTasks.reduce((acc, item, index) => {

                acc[item.id] = index + 1
                return acc
            }, {} as Record<number, number>)

            queryClient.setQueryData(cacheKey, newColumns)
            mutateCard(MOVE_TASK, {
                status: destination.droppableId,
                items
            })

        }

    };

    return {
        data,
        isSuccess,
        onDragEnd,
        handleAdd,
        currentId,
        onDelete,
        params,
    }
}
