import { ColumnDef } from "@/components/ui/table";
import { useMemo } from "react";

export const usOfficeCols = () => {
  return useMemo<ColumnDef<Office>[]>(
    () => [
      { header: "ID", accessorKey: "id" },
      {
        header: "Nomi",
        accessorKey: "id",
        cell: (_, item) => (
          <span className="whitespace-nowrap lg:break-all">
            {item.properties.name}
          </span>
        ),
      },
      {
        header: "Manzil",
        accessorKey: "id",
        cell: (_, item) => (
          <span className="whitespace-nowrap lg:break-all">
            {item.properties.address}
          </span>
        ),
      },
      {
        header: "Hodimlar soni",
        accessorKey: "id",
        cell: (_, itm) => <span>{itm.properties.employee_count}</span>,
      },
      {
        header: "Tushlik vaqti",
        accessorKey: "id",
        cell: (_, itm) => (
          <span className="whitespace-nowrap lg:break-all">
            {itm.properties.lunch_start_time?.slice(0, 5)} -{" "}
            {itm.properties.lunch_end_time?.slice(0, 5)}
          </span>
        ),
      },
      { header: "Amallar", accessorKey: "actions" },
    ],
    [],
  );
};
