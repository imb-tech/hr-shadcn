import { useEffect, useState } from "react"
import TaskDnd from "./task-dnd"
import TaskHeader from "./task-header"
import CompleteTaskManager from "./create"
import Modal from "@/components/custom/modal"
import { useNavigate, useParams, useSearch } from "@tanstack/react-router"
import { useModal } from "@/hooks/useModal"
import { PROJECTS_TASKS, STATUSES } from "@/constants/api-endpoints"
import DeleteModal from "@/components/custom/delete-modal"

const TaskManagment = () => {
    const params = useParams({ from: "/_main/project/$id" })
    const search: any = useSearch({ from: "/_main/project/$id" })
    const navigate = useNavigate()
    const { isOpen } = useModal("task-modal")

    const [statusId, setStatusId] = useState<number>()
    const [currentId, setCurrentId] = useState<number>()

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
                    onClickItem={(id) => setStatusId(id)}
                    onDelete={(id) => setCurrentId(id)}
                />
            </div>

            <Modal onClose={closeModal} size="max-w-3xl" modalKey="task-modal">
                <CompleteTaskManager statusId={statusId} />
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
