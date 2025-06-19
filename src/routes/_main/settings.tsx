import Page from "@/layouts/page";
import SettingsPage from "@/pages/settings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Page breadcrumb={["So'rovlar ro'yxati"]}>
      <SettingsPage />
    </Page>
  );
}
