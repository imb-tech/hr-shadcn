import usePath from "@/components/sidebar/usePath";
import { COMPANIES } from "@/constants/api-endpoints";
import usePermissions from "@/hooks/use-permissions";
import { useGet } from "@/hooks/useGet";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_main/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { links } = usePath();
  const { permissions } = usePermissions();
  const { data, isLoading } = useGet<FeatureCollection>(COMPANIES, {
    options: {
      enabled: !!permissions?.office_view,
    },
  });

  useEffect(() => {
    const url = links.find((us) => us.enabled);

    if (url?.to !== "/") {
      navigate({
        to: url?.to as string,
      });
    } else if (data?.features?.[0]?.id) {
      navigate({
        to: "/office/$id",
        params: { id: data?.features?.[0]?.id.toString() },
      });
    } else {
      navigate({
        to: "/office/$id",
        params: { id: "1" },
      });
    }
  }, [data]);

  return (
    <div className=" p-6 rounded-md max-auto">
      {isLoading ? "Sahifa yuklanmoqda" : ""}
    </div>
  );
}
