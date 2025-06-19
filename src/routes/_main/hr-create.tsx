import Page from "@/layouts/page";
import CreateHrForm from "@/pages/hr/create-hr-form";
import { Button } from "@heroui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_main/hr-create")({
  component: RouteComponent,
});
 
function RouteComponent() {
  const navigate = useNavigate();

  return (
    <Page
      breadcrumb={["Hodimlar"]}
      leftComponent={
        <Button
          className="min-w-4"
          variant="flat"
          onPress={() => navigate({ to: "/hr" })}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      }
    >
      <CreateHrForm />
    </Page>
  );
}
