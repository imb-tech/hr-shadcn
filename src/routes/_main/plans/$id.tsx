import Page from "@/layouts/page";
import CreatePlan from "@/pages/plans/create-plan";
import { plans } from "@/pages/plans/plan-selector";
import { Button } from "@heroui/button";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_main/plans/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/_main/plans/$id" });
  const breadcrumb = plans?.find((el) => el.id === id);
  return (
    <Page
      leftComponent={
        <Button
          className="min-w-4"
          variant="flat"
          onPress={() => navigate({ to: "/plans" })}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      }
      breadcrumb={["To'lov va obunalar", breadcrumb?.name ?? ""]}
    >
      {/* <div>Sahifa topilmadi</div> */}
      <CreatePlan/>
    </Page>
  );
}
