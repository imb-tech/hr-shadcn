import { useCallback, useEffect, useRef, useState } from "react"
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
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const minimapRef = useRef<HTMLDivElement>(null)
    const search: any = useSearch({ from: "/_main/project/$id" })
    const navigate = useNavigate()
    const { isOpen } = useModal("task-modal")

    const [scrollLeft, setScrollLeft] = useState(0)
    const [maxScroll, setMaxScroll] = useState(0)
    const [focusWidth, setFocusWidth] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [statusId, setStatusId] = useState<number>()
    const [currentId, setCurrentId] = useState<number>()

    useEffect(() => {
        const container = containerRef.current
        const content = contentRef.current
        if (container && content) {
            setMaxScroll(container.scrollWidth - container.clientWidth)
            setFocusWidth((container.clientWidth / content.scrollWidth) * 100)
        }
    }, [])

    const handleScroll = useCallback(() => {
        const container = containerRef.current
        if (container) {
            setScrollLeft(container.scrollLeft)
        }
    }, [])

    const moveScroll = useCallback(
        (clientX: number) => {
            const minimap = minimapRef.current
            const container = containerRef.current
            if (!minimap || !container) return

            const rect = minimap.getBoundingClientRect()
            const x = clientX - rect.left
            const percent = Math.min(Math.max(x / minimap.clientWidth, 0), 1)
            container.scrollLeft = percent * maxScroll
            setScrollLeft(container.scrollLeft)
        },
        [maxScroll],
    )

    const startDrag = useCallback(
        (e: React.MouseEvent) => {
            setIsDragging(true)
            moveScroll(e.clientX)
        },
        [moveScroll],
    )

    const stopDrag = useCallback(() => {
        setIsDragging(false)
    }, [])

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging) return
            moveScroll(e.clientX)
        },
        [isDragging, moveScroll],
    )

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", stopDrag)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", stopDrag)
        }
    }, [handleMouseMove, stopDrag])

    const focusLeft =
        maxScroll > 0 ? (scrollLeft / maxScroll) * (100 - focusWidth) : 0

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
        <div className="relative max-w-full">
            <TaskHeader />
            <div
                className="max-w-full overflow-x-scroll no-scrollbar-x"
                ref={containerRef}
                onScroll={handleScroll}
            >
                <div ref={contentRef} className="inline-flex">
                    <TaskDnd
                        onClickItem={(id) => setStatusId(id)}
                        onDelete={(id) => setCurrentId(id)}
                    />
                </div>
            </div>

            <div className="fixed bottom-4 right-4 h-14 bg-gray-800 p-[2px] rounded-md">
                <div
                    ref={minimapRef}
                    className="h-full w-full bg-gray-800 rounded-md"
                    onMouseDown={startDrag}
                >
                    <div className="relative w-full h-full flex gap-0.5 p-1">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="h-full w-7 bg-card rounded-[2px]"
                            />
                        ))}
                        <div
                            className="absolute top-0 h-full border-2 border-blue-500 bg-blue-500/20 rounded-md cursor-all-scroll"
                            style={{
                                width: `${focusWidth}%`,
                                left: `${focusLeft}%`,
                            }}
                        />
                    </div>
                </div>
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
