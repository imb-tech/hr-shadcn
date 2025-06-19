import Page from "@/layouts/page";
import CreateHrForm from "@/pages/hr/create-hr-form";
import { Button } from "@heroui/button";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createLazyFileRoute("/_main/hr-edit/$hr-edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <Page
      breadcrumb={["Hodimlar"]}
      leftComponent={
        <Button
          variant="light"
          className="min-w-4"
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
