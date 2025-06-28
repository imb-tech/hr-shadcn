import { FILTER, TASKLY_PROJECT } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useState } from "react"
import ProjectCard from "./project-card"
import { Card, CardContent } from "@/components/ui/card"
import { CirclePlus } from "lucide-react"
import Modal from "@/components/custom/modal"
import ProjectCreate from "./create"
import { useModal } from "@/hooks/useModal"
import DeleteModal from "@/components/custom/delete-modal"
import { ParamMultiCombobox } from "@/components/as-params/multi-combobox"
import { useSearch } from "@tanstack/react-router"

type Props = {}

function TaskBoard({}: Props) {
    const search = useSearch({ from: "/_main/project/" })
    const [searchCustomer, setCustomerSearch] = useState("")
    const [current, setCurrent] = useState<FormValues | null>(null)
    const { openModal: openModalProject } = useModal("project-create")
    const { openModal: openModalDelete } = useModal("project-delete")
    const { data: dataCustomer, isLoading: isLoadingCustomer } = useGet<
        Human[]
    >(`${FILTER}user`, {
        params: { search: searchCustomer },
    })
    const { data: dataStatus } = useGet<{ todo: number; finished: number }>(
        `taskly/tasks-stats`,
        {
            params: { search: search },
        },
    )
    const {
        data: dataProjects,
        isSuccess: isSuccessProject,
        isLoading: isLoadingProject,
    } = useGet<FormValues[]>(TASKLY_PROJECT, {
        params: search,
    })

    const handleAdd = () => {
        setCurrent(null)
        openModalProject()
    }
    const handleItem = (item: FormValues) => {
        setCurrent(item)
        openModalProject()
    }
    const handleDelete = (item: FormValues) => {
        setCurrent(item)
        openModalDelete()
    }

    console.log(dataStatus)

    return (
        <div className="w-full space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
                <ParamMultiCombobox
                    labelKey="full_name"
                    valueKey="id"
                    options={
                        dataCustomer?.map((item) => ({
                            id: item.id,
                            full_name: `${item.first_name} ${item.last_name}`,
                        })) || []
                    }
                    paramName={"user_id"}
                    className="w-full"
                    label="Hodim"
                    onSearchChange={(val) => setCustomerSearch(val)}
                    isLoading={isLoadingCustomer}
                />
                <Card className="bg-secondary/90">
                    <CardContent className="flex justify-between items-center gap-3 py-2">
                        <span>Topshiriqlar: {dataStatus?.todo || 0}</span>
                        <span>Yakunlanganlar: {dataStatus?.finished || 0}</span>
                    </CardContent>
                </Card>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
                {isSuccessProject &&
                    dataProjects?.map((item) => (
                        <ProjectCard
                            item={item}
                            handleItem={(val) => handleItem(val)}
                            handleDelete={(val) => handleDelete(val)}
                        />
                    ))}
                {isLoadingProject &&
                    Array.from({ length: 2 }).map((_, index) => (
                        <Card
                            key={index}
                            onClick={handleAdd}
                            className="cursor-pointer shadow-lg min-h-[244px] animate-pulse rounded-md bg-muted"
                        >
                            <CardContent className="flex text-2xl items-center justify-center gap-2 h-full"></CardContent>
                        </Card>
                    ))}
                <Card
                    onClick={handleAdd}
                    className="cursor-pointer shadow-lg min-h-[244px]"
                >
                    <CardContent className="flex text-2xl items-center justify-center gap-2 h-full">
                        <CirclePlus size={30} /> <h1>Loyiha qo'shish</h1>
                    </CardContent>
                </Card>
            </div>

            <Modal title={"Loyiha qo'shish"} modalKey="project-create">
                <ProjectCreate item={current || undefined} />
            </Modal>
            <DeleteModal
                modalKey="project-delete"
                id={current?.id}
                path={TASKLY_PROJECT}
            />
        </div>
    )
}

export default TaskBoard
