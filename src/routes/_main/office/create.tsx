import Page from "@/layouts/page";
import CreateOfficeForm from "@/pages/office/create-office-form";
import { Button } from "@heroui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_main/office/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  return (
    <Page
      breadcrumb={["Ofis qo'shish"]}
      leftComponent={
        <Button
          variant="flat"
          className="min-w-4"
          onPress={() => navigate({ to: "/" })}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      }
    >
      <CreateOfficeForm />
    </Page>
  );
}
