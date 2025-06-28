import { useEffect, useState } from "react"
import TaskHeader from "./task-dnd/task-header"
import CompleteTaskManager from "./task-dnd/create"
import Modal from "@/components/custom/modal"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useModal } from "@/hooks/useModal"
import { PROJECTS_TASKS, STATUSES } from "@/constants/api-endpoints"
import DeleteModal from "@/components/custom/delete-modal"
import TaskDnd from "./task-dnd/task-dnd"
import { useTaskDndHandlers } from "./task-dnd/useTaskDndhandlers"

const TaskManagment = () => {
    const search: any = useSearch({ from: "/_main/project/$id" })
    const navigate = useNavigate()
    const { isOpen } = useModal("task-modal")
    const {
        data,
        isSuccess,
        onDragEnd,
        handleAdd,
        currentId,
        onDelete,
        params,
        isLoading,
    } = useTaskDndHandlers()

    const closeModal = () => {
        navigate({
            search: {
                ...search,
                task: undefined,
            },
        })
    }

    useEffect(() => {
        if (!isOpen) {
            closeModal()
        }
    }, [isOpen])

    return (
        <div className="relative">
            <TaskHeader />
            <div className="max-w-full h-[83vh] 2xl:h-[87vh]  overflow-x-scroll no-scrollbar-x overflow-y-hidden">
                <TaskDnd
                    currentId={currentId}
                    onDelete={onDelete}
                    handleAdd={handleAdd}
                    data={data || []}
                    params={params}
                    isSuccess={isSuccess}
                    onDragEnd={onDragEnd}
                    isLoading={isLoading}
                />
            </div>

            <Modal
                onClose={closeModal}
                size="max-w-3xl"
                title={<span className="opacity-0">Vazifalar qo'shish</span>}
                modalKey="task-modal"
            >
                <CompleteTaskManager currentId={currentId} params={params} />
            </Modal>
            <DeleteModal
                modalKey="project-delete"
                id={currentId}
                path={STATUSES}
                refetchKeys={[`${PROJECTS_TASKS}/${params?.id}`]}
            />
        </div>
    )
}

export default TaskManagment
