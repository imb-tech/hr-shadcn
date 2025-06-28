import { COMPANIES } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useNavigate } from "@tanstack/react-router"
import { usOfficeCols } from "./cols"
import CreateOfficeForm from "./create-office-form"
import { DataTable } from "@/components/ui/datatable"
import DeleteModal from "@/components/custom/delete-modal"
import Modal from "@/components/custom/modal"
import { useModal } from "@/hooks/useModal"
import { useStore } from "@/hooks/use-store"
import { useTranslation } from "react-i18next"

export default function OfficePage() {
    const { openModal } = useModal("delete")
    const { openModal: openEdit } = useModal()
    const { setStore, store } = useStore<Office>("office-data")
    const navigate = useNavigate()
    const { data: companies, isLoading } = useGet<FeatureCollection>(COMPANIES)

    const { t } = useTranslation()

    function handleEdit(itm: Office) {
        setStore(itm)
        openEdit()
    }

    function onRowClick(itm: Office) {
        navigate({
            to: "/office/$id",
            params: {
                id: itm.id.toString(),
            },
        })
    }

    function handleDelete(itm: Office) {
        setStore(itm)
        openModal()
    }

    return (
        <div>
            <DataTable
                numeration
                columns={usOfficeCols()}
                data={companies?.features ?? []}
                loading={isLoading}
                onDelete={(row) => handleDelete(row.original)}
                onEdit={(row) => handleEdit(row.original)}
                onRowClick={onRowClick}
            />

            <DeleteModal id={store?.id} path={COMPANIES} />

            <Modal size="max-w-3xl" title={t("Ofis qo'shish")}>
                <CreateOfficeForm />
            </Modal>
        </div>
    )
}
