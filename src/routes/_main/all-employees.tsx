import Page from "@/layouts/page";
import AllEmployeesPage from "@/pages/all-employees";
import { Button } from "@heroui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_main/all-employees")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <Page
      breadcrumb={["Hodimlar ro'yxati"]}
      leftComponent={
        <Button
          className="min-w-4"
          variant="flat"
          onPress={() => navigate({ to: "/" })}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      }
    >
      <AllEmployeesPage />
    </Page>
  );
}
