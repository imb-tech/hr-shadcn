import ParamDatePicker from "@/components/as-params/date-picker";
import PageLayout from "@/layouts/page-layout";
import OfficeDetail from "@/pages/office-detail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/office/$id")({
  component: RouteComponent,
  validateSearch: (s: { tab?: string }) => s,
});

function RouteComponent() {
  return (
    <PageLayout
      breadcrumb={["Ofis", "Ofis ma'lumotlari va hodimlar"]}
      rightComponent={<ParamDatePicker titleHidden={false}  variant="default" />}
    >
      <OfficeDetail />
    </PageLayout>
  );
}
