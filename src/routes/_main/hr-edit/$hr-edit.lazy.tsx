import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/page-layout";
import CreateHrForm from "@/pages/hr/create-hr-form";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createLazyFileRoute("/_main/hr-edit/$hr-edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <PageLayout
      breadcrumb={["Hodimlar"]}
      leftComponent={
        <Button
          className="min-w-4"
          onClick={() => navigate({ to: "/hr" })}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      }
    >
      <CreateHrForm />
    </PageLayout>
  );
}
