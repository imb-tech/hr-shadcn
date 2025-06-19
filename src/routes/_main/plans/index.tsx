import Page from "@/layouts/page";
import PlansPage from "@/pages/plans";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/plans/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Page breadcrumb={["To'lov va obunalar"]}>
      <PlansPage />
    </Page>
  );
}
