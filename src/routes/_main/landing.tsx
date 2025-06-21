import PageLayout from "@/layouts/page-layout";
import LandingMain from "@/pages/landing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/landing")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageLayout breadcrumb={["Foydalanish bo'yicha qo'llanma"]}>
      <div id="office"></div>
      <LandingMain />
    </PageLayout>
  );
}
