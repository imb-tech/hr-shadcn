import PButton from "@/components/ui/p-button";
import PageLayout from "@/layouts/page-layout";
import HrPage from "@/pages/hr";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_main/hr")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <PageLayout
      breadcrumb={["Hodimlar"]}
      rightComponent={
        <PButton
          allow={["employee_control"]}
          className="flex gap-1"
          onClick={() => navigate({ to: "/hr-create" })}
        >
          <Plus className="w-5 h-5" /> Hodim qo'shish
        </PButton>
      }
    >
      <HrPage />
    </PageLayout>
  );
}
