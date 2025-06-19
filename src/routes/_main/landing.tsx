import Page from "@/layouts/page";
import LandingMain from "@/pages/landing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/landing")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Page breadcrumb={["Foydalanish bo'yicha qo'llanma"]}>
      <div id="office"></div>
      <LandingMain />
    </Page>
  );
}
