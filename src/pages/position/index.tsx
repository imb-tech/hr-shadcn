import { POSITION } from "@/constants/api-endpoints"
import { useStore } from "@/hooks/use-store"
import { useGet } from "@/hooks/useGet"
import { usPostionsCols } from "./cols"
import CreatePositionsForm from "./create-position-form"
import { useModal } from "@/hooks/useModal"
import { DataTable } from "@/components/ui/datatable"
import DeleteModal from "@/components/custom/delete-modal"
import Modal from "@/components/custom/modal"
import { Plus } from "lucide-react"
import PButton from "@/components/ui/p-button"
import { formatMoney } from "@/lib/format-money"
import { Badge } from "@/components/ui/badge"

export default function PostionsPage() {
    const { openModal: openDeleteModal } = useModal("delete")
    const { openModal: openUpdateModal } = useModal()
    const { data, isSuccess, isLoading } = useGet<Position[]>(POSITION)
    const { store, setStore } = useStore<Position>("position-data")
    const { openModal:openModalCreate } = useModal()
    const { remove } = useStore<Position>("position-data")

    function handleClick() {
        remove()
        openModalCreate()
    }

    function handleItem(item: Position) {
        if (!item.id) return
        setStore(item)
        openUpdateModal()
    }

    function handleDelete(item: Position) {
        if (item) {
            openDeleteModal()
            setStore(item)
        }
    }

    return (
        <div className="w-full">
            <DataTable
                numeration
                columns={usPostionsCols()}
                data={(isSuccess && data) || []}
                loading={isLoading}
                onDelete={({ original }) => handleDelete(original)}
                onEdit={({ original }) =>
                    handleItem({
                        ...original,
                        work_shift_start: original.work_shift_start?.slice(
                            0,
                            5,
                        ),
                        work_shift_end: original.work_shift_end?.slice(0, 5),
                    })
                }
                viewAll={true}
                actionPermissions={["roles_control"]}
                head={
                    <div className="flex flex-col mb-3 lg:flex-row items-center gap-3 justify-between">
                         <div className="flex items-center gap-3">
                            <h1 className="text-xl font-medium">
                                Lavozimlar ro'yxati
                            </h1>
                            <Badge className="text-sm">{formatMoney(data?.length)}</Badge>
                        </div>
                        <PButton
                            allow={["roles_control"]}
                            className="flex gap-1"
                            onClick={handleClick}
                        >
                            <Plus className="w-5 h-5" />
                            Lavozim qo'shish
                        </PButton>
                    </div>
                }
            />

            <DeleteModal id={store?.id} path={POSITION} />

            <Modal
                size="max-w-2xl"
                title={store?.id ? "Lavozim tahrirlash" : "Lavozim qo'shish"}
            >
                <CreatePositionsForm dataItem={store} />
            </Modal>
        </div>
    )
}
