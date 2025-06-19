import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/page-layout";
import AllEmployeesPage from "@/pages/all-employees";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_main/all-employees")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <PageLayout
      breadcrumb={["Hodimlar ro'yxati"]}
      leftComponent={
        <Button
          className="min-w-4"
          onClick={() => navigate({ to: "/" })}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      }
    >
      <AllEmployeesPage />
    </PageLayout>
  );
}
