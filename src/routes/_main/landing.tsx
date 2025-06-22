import PageLayout from "@/layouts/page-layout";
import LandingMain from "@/pages/landing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/landing")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageLayout>
      <div id="office"></div>
      <LandingMain />
    </PageLayout>
  );
}
