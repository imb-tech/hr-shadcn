import PButton from "@/components/ui/p-button";
import Page from "@/layouts/page";
import HrPage from "@/pages/hr";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_main/hr")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <Page
      breadcrumb={["Hodimlar"]}
      rightComponent={
        <PButton
          allow={["employee_control"]}
          className="flex gap-1"
          onPress={() => navigate({ to: "/hr-create" })}
        >
          <Plus className="w-5 h-5" /> Hodim qo'shish
        </PButton>
      }
    >
      <HrPage />
    </Page>
  );
}
