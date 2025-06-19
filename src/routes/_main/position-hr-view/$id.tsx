import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/page-layout";
import PositionHrView from "@/pages/office-detail/position";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_main/position-hr-view/$id")({
  component: RouteComponent,
});

function RouteComponent() {
   const navigate = useNavigate();
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
      breadcrumb={["Ofis", "Lavozim", "Hodimlar"]}
    >
      <PositionHrView />
    </PageLayout>
  );
}
