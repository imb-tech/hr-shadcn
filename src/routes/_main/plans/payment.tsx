import Page from "@/layouts/page";
import PaymentPage from "@/pages/plans/payment";
import { Button } from "@heroui/button";
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_main/plans/payment")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/_main" });
  return (
    <Page
      leftComponent={
        <Button
          className="min-w-4"
          variant="flat"
          onPress={() =>
            navigate({
              to: "/plans/$id",
              params: { id: search.plan_id!.toString() },
            })
          }
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      }
      breadcrumb={["To'lov"]}
    >
      <PaymentPage />
    </Page>
  );
}
