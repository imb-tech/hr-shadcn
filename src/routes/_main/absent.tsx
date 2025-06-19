import { Button } from "@/components/ui/button";
import PageLayout from "@/layouts/page-layout";
import AbsentPage from "@/pages/absent";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_main/absent")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <PageLayout
      breadcrumb={["Kelmaganlar ro'yxati"]}
      leftComponent={
        <Button
          className="min-w-4"
          onClick={() => navigate({ to: "/" })}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      }
    >
      <AbsentPage />
    </PageLayout>
  );
}
