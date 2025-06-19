import DeleteModal from "@/components/elements/delete-modal";
import Modal from "@/components/ui/modal";
import DataTable from "@/components/ui/table";
import { COMPANIES } from "@/constants/api-endpoints";
import { useModal } from "@/hooks/use-modal";
import { useStore } from "@/hooks/use-store";
import { useGet } from "@/hooks/useGet";
import { useNavigate } from "@tanstack/react-router";
import { usOfficeCols } from "./cols";
import CreateOfficeForm from "./create-office-form";

export default function OfficePage() {
  const { openModal } = useModal("delete");
  const { openModal: openEdit } = useModal();
  const { setStore, store } = useStore<Office>("office-data");
  const navigate = useNavigate();
  const { data: companies, isLoading } = useGet<FeatureCollection>(COMPANIES);

  function handleEdit(itm: Office) {
    setStore(itm);
    openEdit();
  }

  function onRowClick(itm: Office) {
    navigate({
      to: "/office/$id",
      params: {
        id: itm.id.toString(),
      },
    });
  }

  function handleDelete(itm: Office) {
    setStore(itm);
    openModal();
  }

  return (
    <div>
      <DataTable
        columns={usOfficeCols()}
        data={companies?.features ?? []}
        isLoading={isLoading}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onRowClick={onRowClick}
      />

      <DeleteModal id={store?.id} path={COMPANIES} />

      <Modal size="3xl" title="Ofis qo'shish">
        <CreateOfficeForm />
      </Modal>
    </div>
  );
}
