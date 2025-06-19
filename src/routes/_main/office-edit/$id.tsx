import DeleteModal from "@/components/custom/delete-modal";
import Private from "@/components/private";
import { Button } from "@/components/ui/button";
import { COMPANIES } from "@/constants/api-endpoints";
import { useModal } from "@/hooks/useModal";
import PageLayout from "@/layouts/page-layout";
import CreateOfficeForm from "@/pages/office/create-office-form";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { ArrowLeft, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_main/office-edit/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const { openModal } = useModal("delete");

  return (
    <PageLayout
      leftComponent={
        <Button
          className="min-w-4"
          onClick={() => navigate({ to: "/" })}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      }
    >
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Ofis tahrirlash</h1>
        <Private allow={["office_control"]}>
          <p
            className="text-end p-[10px] border border-red-600 rounded-full text-red-500 cursor-pointer bg-zinc-100 dark:bg-zinc-800"
            title="Ofisni o'chrish"
            onClick={openModal}
          >
            <Trash2 size={20} />
          </p>
        </Private>
      </div>
      <CreateOfficeForm />
      <DeleteModal id={id} path={COMPANIES} url="/" />
    </PageLayout>
  );
}
