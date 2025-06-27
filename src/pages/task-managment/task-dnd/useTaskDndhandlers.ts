import { useParams } from "@tanstack/react-router"
import { useGet } from "@/hooks/useGet"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useQueryClient } from "@tanstack/react-query"
import { useModal } from "@/hooks/useModal"
import { PROJECTS_TASKS, STATUSES_MOVE, TASKS } from "@/constants/api-endpoints"
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

    const { mutate: mutateCard } = usePatch({
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [`${PROJECTS_TASKS}/${params?.id}`] }),
    })

    const { mutate: mutateColumn } = usePost({
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [`${PROJECTS_TASKS}/${params?.id}`] }),
    })

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
        const prevColumns = queryClient.getQueryData<any[]>(cacheKey)
        if (!prevColumns) return

        if (type === "column") {
            const newColumns = [...prevColumns]
            const [removed] = newColumns.splice(source.index, 1)
            newColumns.splice(destination.index, 0, removed)

            queryClient.setQueryData(cacheKey, newColumns)

            const from_status = prevColumns[source.index]?.id
            const to_status = prevColumns[destination.index]?.id
            if (from_status && to_status && from_status !== to_status) {
                mutateColumn(STATUSES_MOVE, { from_status, to_status })
            }
            return
        }

        if (source.droppableId !== destination.droppableId) {
            const newColumns = [...prevColumns]
            const fromIndex = newColumns.findIndex((col) => col.id.toString() === source.droppableId)
            const toIndex = newColumns.findIndex((col) => col.id.toString() === destination.droppableId)
            if (fromIndex === -1 || toIndex === -1) return

            const fromTasks = newColumns[fromIndex].tasks || []
            const toTasks = newColumns[toIndex].tasks || []

            const taskIdx = fromTasks.findIndex((t:any) => t.id.toString() === draggableId)
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
