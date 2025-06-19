import { POSITION } from "@/constants/api-endpoints"
import { useStore } from "@/hooks/use-store"
import { useGet } from "@/hooks/useGet"
import { usPostionsCols } from "./cols"
import CreatePositionsForm from "./create-position-form"
import { useModal } from "@/hooks/useModal"
import { DataTable } from "@/components/ui/datatable"
import DeleteModal from "@/components/custom/delete-modal"
import Modal from "@/components/custom/modal"

export default function PostionsPage() {
    const { openModal: openDeleteModal } = useModal("delete")
    const { openModal: openUpdateModal } = useModal()
    const { data, isSuccess, isLoading } = useGet<Position[]>(POSITION)
    const { store, setStore } = useStore<Position>("position-data")

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
                actionPermissions={["roles_control"]}
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
