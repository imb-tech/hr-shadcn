import Page from "@/layouts/page";
import MapPage from "@/pages/map";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/map/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Page breadcrumb={["Xarita"]}>
      <MapPage />
    </Page>
  );
}
