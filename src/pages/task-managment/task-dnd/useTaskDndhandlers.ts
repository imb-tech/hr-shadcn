import { useParams, useSearch } from "@tanstack/react-router"
import { useGet } from "@/hooks/useGet"
import { usePost } from "@/hooks/usePost"
import { useQueryClient } from "@tanstack/react-query"
import { useModal } from "@/hooks/useModal"
import { MOVE_TASK, PROJECTS_TASKS, STATUSES_MOVE } from "@/constants/api-endpoints"
import { useState } from "react"
import { DropResult } from "react-beautiful-dnd"

export const useTaskDndHandlers = () => {
    const params = useParams({ from: "/_main/project/$id" })
    const search = useSearch({ from: "/_main/project/$id" })
    const [currentId, setCurrentId] = useState<number>()
    const { openModal: openModalCreate } = useModal("task-modal")
    const queryClient = useQueryClient()

    const { data, isSuccess, isLoading } = useGet<Column[]>(`${PROJECTS_TASKS}/${params?.id}`, {
        params: search,
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

        const cacheKey = [`${PROJECTS_TASKS}/${params?.id}`, ...Object.values(search)]
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

        const taskId = (draggableId.replace("task-", ""))
        const fromColId = (source.droppableId.replace("column-", ""))
        const toColId = (destination.droppableId.replace("column-", ""))

        if (fromColId !== toColId) {

            const newColumns = [...prevColumns]
            const fromIndex = newColumns.findIndex((col) => col.id.toString() === fromColId)
            const toIndex = newColumns.findIndex((col) => col.id.toString() === toColId)
            if (fromIndex === -1 || toIndex === -1) return

            const fromTasks = [...newColumns[fromIndex].tasks]
            const toTasks = [...newColumns[toIndex].tasks]

            const taskIdx = fromTasks.findIndex((t: any) => t.id.toString() === taskId)
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
            const filterTasks = newColumns?.find(col => col.id.toString() === toColId)?.tasks || [];
            const items = filterTasks.reduce((acc, item, index) => {
                acc[item.id] = index + 1
                return acc
            }, {} as Record<number, number>)

            queryClient.setQueryData(cacheKey, newColumns)

            mutateCard(MOVE_TASK, {
                status: toColId,
                items
            })
        } else {

            const newColumns = [...prevColumns]
            const colIndex = newColumns.findIndex((col) => col.id.toString() === fromColId)
            if (colIndex === -1) return

            const tasks = [...newColumns[colIndex].tasks]
            const taskIdx = tasks.findIndex((t: any) => t.id.toString() === taskId)
            if (taskIdx === -1) return

            const [movingTask] = tasks.splice(taskIdx, 1)
            tasks.splice(destination.index, 0, movingTask)

            newColumns[colIndex] = {
                ...newColumns[colIndex],
                tasks,
                count: tasks.length,
            }
            const filterTasks = newColumns?.find(col => col.id.toString() === toColId)?.tasks || [];
            const items = filterTasks.reduce((acc, item, index) => {

                acc[item.id] = index + 1
                return acc
            }, {} as Record<number, number>)

            queryClient.setQueryData(cacheKey, newColumns)
            mutateCard(MOVE_TASK, {
                status: toColId,
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
        isLoading,
    }
}
