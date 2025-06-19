import PButton from "@/components/ui/p-button";
import { useModal } from "@/hooks/use-modal";
import { useStore } from "@/hooks/use-store";
import Page from "@/layouts/page";
import PostionsPage from "@/pages/position";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_main/position")({
  component: RouteComponent,
});

function RouteComponent() {
  const { openModal } = useModal();
  const { remove } = useStore<Position>("position-data");

  function handleClick() {
    remove();
    openModal();
  }

  return (
    <Page
      breadcrumb={["Lavozimlar"]}
      rightComponent={
        <PButton
          allow={["roles_control"]}
          className="flex gap-1"
          onPress={handleClick}
        >
          <Plus className="w-5 h-5" />
          Lavozim qo'shish
        </PButton>
      }
    >
      <PostionsPage />
    </Page>
  );
}
