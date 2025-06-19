import Page from "@/layouts/page";
import { downloadExcel } from "@/lib/download-excel";
import ViewPage from "@/pages/hr-details/view";
import axiosInstance from "@/services/axios-instance";
import { Button } from "@heroui/button";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { ArrowLeft, Download } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_main/hr-view/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/_main/hr-view/$id" });
  const [isLoadingDown, setIsLoading] = useState(false);

  const handleExcel = async () => {
    setIsLoading(true);
    try {
      const resp = await axiosInstance.get(`hr/user-attendances-excel/${id}`, {
        responseType: "blob",
      });
      downloadExcel({ data: resp.data, name: `hodim_${id}` });
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  return (
    <Page
      breadcrumb={["Hodim ma'lumoti"]}
      leftComponent={
        <Button
          className="min-w-4"
          variant="flat"
          onPress={() => navigate({ to: "/hr" })}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      }
      rightComponent={
        <Button
          onPress={handleExcel}
          isLoading={isLoadingDown}
          className="w-full px-3"
        >
          Yuklab olish <Download size={18} />
        </Button>
      }
    >
      <ViewPage />
    </Page>
  );
}
